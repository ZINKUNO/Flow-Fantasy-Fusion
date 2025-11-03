"""
AI Lineup Prediction Service
Fresh Code - Built for Forte Hacks
Gemini AI-powered lineup optimization for fantasy sports
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
from typing import Dict, List, Tuple
from dataclasses import dataclass
import logging
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    logger.info("Gemini AI configured successfully")
else:
    model = None
    logger.warning("GEMINI_API_KEY not found, using fallback rule-based system")

@dataclass
class PlayerStats:
    """Player performance statistics"""
    player_id: int
    recent_performance: float  # 0-100
    market_value: float  # Estimated NFT market value
    consistency: float  # 0-1
    injury_risk: float  # 0-1
    trending: str  # 'up', 'down', 'stable'

class LineupPredictor:
    """Rule-based lineup prediction engine"""
    
    def __init__(self):
        self.alpha = 0.45  # Weight for recent performance
        self.beta = 0.30   # Weight for market value
        self.gamma = 0.15  # Weight for consistency
        self.delta = 0.10  # Weight for trending
        
    def calculate_player_score(self, stats: PlayerStats) -> float:
        """
        Calculate composite score for a player
        
        Formula: score = α * performance + β * value + γ * consistency + δ * trending - injury_risk
        """
        # Normalize market value (assuming max 10000)
        normalized_value = min(stats.market_value / 100.0, 100.0)
        
        # Trending bonus/penalty
        trending_score = {
            'up': 20.0,
            'stable': 10.0,
            'down': 0.0
        }.get(stats.trending, 10.0)
        
        # Injury risk penalty
        injury_penalty = stats.injury_risk * 15.0
        
        score = (
            self.alpha * stats.recent_performance +
            self.beta * normalized_value +
            self.gamma * (stats.consistency * 100.0) +
            self.delta * trending_score -
            injury_penalty
        )
        
        return max(0.0, score)
    
    def optimize_lineup(
        self,
        available_players: List[int],
        positions: List[str],
        player_stats: Dict[int, PlayerStats],
        strategy: str = 'balanced'
    ) -> Tuple[Dict[str, List[int]], float, str]:
        """
        Optimize lineup based on strategy
        
        Args:
            available_players: List of player IDs available for selection
            positions: Required positions to fill
            player_stats: Dictionary of player statistics
            strategy: 'balanced', 'high-risk', or 'conservative'
        
        Returns:
            Tuple of (lineup, expected_score, rationale)
        """
        # Calculate scores for all players
        player_scores = {}
        for player_id in available_players:
            if player_id in player_stats:
                player_scores[player_id] = self.calculate_player_score(player_stats[player_id])
            else:
                # Default score for unknown players
                player_scores[player_id] = 50.0
        
        # Adjust scores based on strategy
        if strategy == 'high-risk':
            # Favor high market value players
            for player_id, stats in player_stats.items():
                if stats.market_value > 500:
                    player_scores[player_id] *= 1.25
        elif strategy == 'conservative':
            # Favor consistent players with low injury risk
            for player_id, stats in player_stats.items():
                if stats.consistency > 0.7 and stats.injury_risk < 0.3:
                    player_scores[player_id] *= 1.15
        
        # Sort players by score
        sorted_players = sorted(
            player_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Assign players to positions (simple greedy approach)
        lineup = {}
        used_players = set()
        expected_score = 0.0
        
        for position in positions:
            # Find best available player for this position
            for player_id, score in sorted_players:
                if player_id not in used_players:
                    if position not in lineup:
                        lineup[position] = []
                    lineup[position].append(player_id)
                    used_players.add(player_id)
                    expected_score += score
                    break
        
        # Generate rationale
        rationale = self._generate_rationale(
            lineup,
            player_stats,
            strategy,
            expected_score
        )
        
        return lineup, expected_score, rationale
    
    def _generate_rationale(
        self,
        lineup: Dict[str, List[int]],
        player_stats: Dict[int, PlayerStats],
        strategy: str,
        expected_score: float
    ) -> str:
        """Generate human-readable explanation of lineup selection"""
        
        total_value = 0
        trending_up = 0
        
        for position, players in lineup.items():
            for player_id in players:
                if player_id in player_stats:
                    stats = player_stats[player_id]
                    total_value += stats.market_value
                    if stats.trending == 'up':
                        trending_up += 1
        
        rationale_parts = [
            f"Optimized for {strategy} strategy.",
            f"Expected score: {expected_score:.1f}.",
        ]
        
        if trending_up > 2:
            rationale_parts.append(f"{trending_up} players trending upward.")
        
        if total_value > 3000:
            rationale_parts.append("High-value player concentration.")
        
        return " ".join(rationale_parts)


# Initialize predictor
predictor = LineupPredictor()

# Mock player database (in production, this would query Find Labs / Dapper APIs)
def get_player_stats(player_ids: List[int]) -> Dict[int, PlayerStats]:
    """
    Mock function to retrieve player statistics
    In production: Query Find Labs API, Dapper Moments, on-chain data
    """
    stats = {}
    
    for player_id in player_ids:
        # Generate semi-realistic mock data
        random.seed(player_id)  # Deterministic for same player
        
        stats[player_id] = PlayerStats(
            player_id=player_id,
            recent_performance=random.uniform(40.0, 95.0),
            market_value=random.uniform(50.0, 2000.0),
            consistency=random.uniform(0.3, 0.95),
            injury_risk=random.uniform(0.0, 0.4),
            trending=random.choice(['up', 'up', 'stable', 'down'])
        )
    
    return stats


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Flow Fantasy Fusion AI',
        'version': '1.0.0'
    })


def predict_lineup_with_gemini(available_players, positions, player_stats, strategy):
    """Use Gemini AI to predict optimal lineup"""
    try:
        # Prepare player data for Gemini
        player_data_str = "\n".join([
            f"Player {pid}: Performance={stats.recent_performance:.1f}, "
            f"Value=${stats.market_value:.0f}, Consistency={stats.consistency:.2f}, "
            f"Trending={stats.trending}, Injury Risk={stats.injury_risk:.2f}"
            for pid, stats in player_stats.items()
        ])
        
        prompt = f"""You are a fantasy sports AI assistant. Analyze these players and suggest the optimal lineup.

Available Players:
{player_data_str}

Required Positions: {', '.join(positions)}
Strategy: {strategy}

Please provide:
1. Best player for each position (use player IDs)
2. Expected total score (0-100 scale)
3. Brief rationale (2-3 sentences)

Format your response as:
LINEUP: [list of player IDs in order of positions]
SCORE: [number]
RATIONALE: [your explanation]"""

        response = model.generate_content(prompt)
        text = response.text
        
        # Parse Gemini response
        lineup_dict = {}
        expected_score = 75.0
        rationale = "AI-optimized lineup based on performance metrics."
        
        # Extract lineup
        if "LINEUP:" in text:
            lineup_line = text.split("LINEUP:")[1].split("\n")[0]
            player_ids = [int(x.strip()) for x in lineup_line.replace("[", "").replace("]", "").split(",") if x.strip().isdigit()]
            for i, pos in enumerate(positions):
                if i < len(player_ids):
                    lineup_dict[pos] = [player_ids[i]]
        
        # Extract score
        if "SCORE:" in text:
            score_line = text.split("SCORE:")[1].split("\n")[0]
            try:
                expected_score = float(''.join(filter(str.isdigit, score_line)))
            except:
                pass
        
        # Extract rationale
        if "RATIONALE:" in text:
            rationale = text.split("RATIONALE:")[1].strip()
        
        return lineup_dict, expected_score, rationale
        
    except Exception as e:
        logger.error(f"Gemini prediction failed: {e}, falling back to rule-based")
        return None


@app.route('/api/ai/predict-lineup', methods=['POST'])
def predict_lineup():
    """
    Main endpoint for AI lineup prediction
    
    Expected payload:
    {
        "leagueId": 1,
        "playerAddress": "0x123...",
        "availablePlayers": [1, 2, 3, 4, 5],
        "positions": ["PG", "SG", "SF", "PF", "C"],
        "optimizationGoal": "balanced"
    }
    """
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['leagueId', 'playerAddress', 'availablePlayers', 'positions']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        league_id = data['leagueId']
        player_address = data['playerAddress']
        available_players = data['availablePlayers']
        positions = data['positions']
        strategy = data.get('optimizationGoal', 'balanced')
        
        logger.info(f"Predicting lineup for league {league_id}, player {player_address}")
        
        # Get player statistics
        player_stats = get_player_stats(available_players)
        
        # Try Gemini AI first, fallback to rule-based
        lineup = None
        expected_score = 0
        rationale = ""
        ai_method = "rule-based"
        
        if model:
            result = predict_lineup_with_gemini(available_players, positions, player_stats, strategy)
            if result:
                lineup, expected_score, rationale = result
                ai_method = "gemini-ai"
        
        # Fallback to rule-based if Gemini fails
        if not lineup:
            lineup, expected_score, rationale = predictor.optimize_lineup(
                available_players=available_players,
                positions=positions,
                player_stats=player_stats,
                strategy=strategy
            )
        
        # Calculate confidence (based on data availability and score distribution)
        confidence = min(0.95, 0.65 + (expected_score / 1000.0))
        
        response = {
            'success': True,
            'lineup': {
                'positions': lineup,
                'expectedScore': round(expected_score, 2),
                'confidence': round(confidence, 2),
                'rationale': rationale,
                'aiMethod': ai_method
            },
            'metadata': {
                'leagueId': league_id,
                'playerAddress': player_address,
                'strategy': strategy,
                'timestamp': os.times().elapsed
            }
        }
        
        logger.info(f"Lineup prediction successful: method={ai_method}, score={expected_score:.1f}, confidence={confidence:.2f}")
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error predicting lineup: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/ai/player-analysis', methods=['POST'])
def player_analysis():
    """
    Endpoint for individual player analysis
    
    Expected payload:
    {
        "playerId": 42
    }
    """
    try:
        data = request.get_json()
        player_id = data.get('playerId')
        
        if not player_id:
            return jsonify({'error': 'Missing playerId'}), 400
        
        stats = get_player_stats([player_id])
        if player_id not in stats:
            return jsonify({'error': 'Player not found'}), 404
        
        player_stats = stats[player_id]
        score = predictor.calculate_player_score(player_stats)
        
        response = {
            'success': True,
            'playerId': player_id,
            'score': round(score, 2),
            'stats': {
                'recentPerformance': round(player_stats.recent_performance, 2),
                'marketValue': round(player_stats.market_value, 2),
                'consistency': round(player_stats.consistency, 2),
                'injuryRisk': round(player_stats.injury_risk, 2),
                'trending': player_stats.trending
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Error analyzing player: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting AI service on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
