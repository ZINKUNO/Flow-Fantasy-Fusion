"""
Gemini-powered AI Chat Service for Flow Fantasy Fusion
Provides intelligent lineup suggestions and fantasy sports advice
"""

import os
import json
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
import google.generativeai as genai
from datetime import datetime

@dataclass
class Player:
    id: int
    name: str
    position: str
    recent_performance: float  # 0-100 scale
    consistency: float  # 0-1 scale
    nft_value: float  # in FLOW
    trend: float  # -1 to 1
    team: str = "Unknown"
    
    def to_dict(self):
        return asdict(self)

@dataclass
class LineupSuggestion:
    players: List[Player]
    expected_score: float
    risk_level: str
    reasoning: str
    confidence: float
    
    def to_dict(self):
        return {
            'players': [p.to_dict() for p in self.players],
            'expected_score': self.expected_score,
            'risk_level': self.risk_level,
            'reasoning': self.reasoning,
            'confidence': self.confidence
        }

class GeminiFantasyAssistant:
    def __init__(self, api_key: str):
        """Initialize Gemini AI assistant"""
        genai.configure(api_key=api_key)
        
        # Use Gemini Pro model
        self.model = genai.GenerativeModel('gemini-pro')
        
        # Initialize chat with system context
        self.chat = self.model.start_chat(history=[])
        
        # Set up the system prompt
        self.system_context = """
You are an expert Fantasy Sports AI Assistant for Flow Fantasy Fusion, a blockchain-based fantasy sports platform on Flow.

Your role:
- Help users build optimal fantasy lineups
- Provide strategic advice based on player performance data
- Explain your reasoning clearly and conversationally
- Adapt to user preferences (risk appetite, budget, favorite teams)
- Be enthusiastic and engaging about fantasy sports

Key features of the platform:
- Users can stake FLOW, FUSD, or USDC tokens
- NBA Top Shot NFTs can be used as player entries
- Automated settlements via Forte Scheduled Transactions
- Prize pools distributed to top 3 winners (60%, 25%, 15%)

When suggesting lineups:
- Consider recent performance, consistency, and trends
- Balance risk vs reward based on user preferences
- Explain why each player is a good choice
- Provide expected scores and confidence levels
- Mention NFT values when relevant

Be conversational, helpful, and show personality!
"""
        
        # Send system context
        self.chat.send_message(self.system_context)
        
        # User preferences
        self.user_preferences = {
            'risk_appetite': 'balanced',
            'budget': None,
            'favorite_positions': [],
            'favorite_teams': [],
            'avoid_players': []
        }
        
        # Available players database (mock data)
        self.players_db = self._initialize_players_db()
    
    def _initialize_players_db(self) -> List[Player]:
        """Initialize mock player database"""
        import random
        
        positions = ["PG", "SG", "SF", "PF", "C"]
        teams = ["Lakers", "Warriors", "Celtics", "Heat", "Bucks", "Nuggets", "Suns", "Mavericks"]
        
        players = []
        player_names = [
            "LeBron James", "Stephen Curry", "Kevin Durant", "Giannis Antetokounmpo",
            "Luka Doncic", "Jayson Tatum", "Joel Embiid", "Nikola Jokic",
            "Damian Lillard", "Anthony Davis", "Kawhi Leonard", "Jimmy Butler",
            "Devin Booker", "Trae Young", "Donovan Mitchell", "Ja Morant",
            "Zion Williamson", "Jaylen Brown", "Paul George", "Bradley Beal",
            "Kyrie Irving", "James Harden", "Anthony Edwards", "Tyrese Haliburton",
            "DeMar DeRozan", "Karl-Anthony Towns", "Bam Adebayo", "Pascal Siakam",
            "Julius Randle", "Draymond Green", "Klay Thompson", "Khris Middleton",
            "CJ McCollum", "De'Aaron Fox", "Shai Gilgeous-Alexander", "Jrue Holiday",
            "Fred VanVleet", "Dejounte Murray", "Darius Garland", "LaMelo Ball",
            "Jaren Jackson Jr.", "Scottie Barnes", "Franz Wagner", "Cade Cunningham",
            "Evan Mobley", "Paolo Banchero", "Jalen Green", "Alperen Sengun",
            "Keegan Murray", "Bennedict Mathurin"
        ]
        
        for i, name in enumerate(player_names):
            players.append(Player(
                id=i + 1,
                name=name,
                position=positions[i % len(positions)],
                recent_performance=random.uniform(15, 48),
                consistency=random.uniform(0.65, 0.95),
                nft_value=random.uniform(0.5, 15),
                trend=random.uniform(-0.3, 0.5),
                team=teams[i % len(teams)]
            ))
        
        return players
    
    async def chat(self, message: str, context: Optional[Dict] = None) -> Dict:
        """
        Handle user messages and return AI responses
        
        Args:
            message: User's message
            context: Optional context (league info, player stats, etc.)
        
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Build enhanced prompt with context
            enhanced_message = self._build_enhanced_prompt(message, context)
            
            # Get response from Gemini
            response = self.chat.send_message(enhanced_message)
            
            # Check if this is a lineup request
            is_lineup_request = any(keyword in message.lower() for keyword in 
                                   ['lineup', 'suggest', 'recommend', 'team', 'players'])
            
            result = {
                'response': response.text,
                'timestamp': datetime.now().isoformat(),
                'is_lineup_suggestion': is_lineup_request
            }
            
            # If it's a lineup request, also generate structured data
            if is_lineup_request:
                lineup = self._generate_lineup_data()
                result['lineup_data'] = lineup.to_dict()
            
            return result
            
        except Exception as e:
            print(f"Error in chat: {e}")
            return {
                'response': "I apologize, but I'm having trouble processing your request. Could you please rephrase that?",
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _build_enhanced_prompt(self, message: str, context: Optional[Dict]) -> str:
        """Build enhanced prompt with user preferences and context"""
        prompt_parts = [message]
        
        # Add user preferences
        if self.user_preferences['risk_appetite']:
            prompt_parts.append(f"\nUser's risk preference: {self.user_preferences['risk_appetite']}")
        
        if self.user_preferences['budget']:
            prompt_parts.append(f"\nUser's budget: {self.user_preferences['budget']} FLOW")
        
        if self.user_preferences['favorite_teams']:
            prompt_parts.append(f"\nFavorite teams: {', '.join(self.user_preferences['favorite_teams'])}")
        
        # Add context if provided
        if context:
            if 'league_info' in context:
                prompt_parts.append(f"\nLeague info: {json.dumps(context['league_info'])}")
            
            if 'available_players' in context:
                prompt_parts.append(f"\nAvailable players: {len(context['available_players'])} players")
        
        return "\n".join(prompt_parts)
    
    def _generate_lineup_data(self) -> LineupSuggestion:
        """Generate structured lineup data based on user preferences"""
        strategy = self.user_preferences['risk_appetite']
        
        if strategy == 'conservative':
            return self._generate_conservative_lineup()
        elif strategy == 'aggressive':
            return self._generate_aggressive_lineup()
        else:
            return self._generate_balanced_lineup()
    
    def _generate_balanced_lineup(self) -> LineupSuggestion:
        """Generate a balanced lineup"""
        # Sort by weighted score
        sorted_players = sorted(
            self.players_db,
            key=lambda p: (
                p.recent_performance * 0.45 +
                p.consistency * 50 * 0.30 +
                p.nft_value * 2 * 0.15 +
                (p.trend + 1) * 25 * 0.10
            ),
            reverse=True
        )
        
        # Select one player per position
        lineup = []
        positions_filled = set()
        
        for player in sorted_players:
            if player.position not in positions_filled:
                lineup.append(player)
                positions_filled.add(player.position)
                if len(lineup) == 5:
                    break
        
        expected_score = sum(p.recent_performance for p in lineup)
        
        return LineupSuggestion(
            players=lineup,
            expected_score=expected_score,
            risk_level="Medium",
            reasoning="Balanced lineup with consistent performers and upside potential",
            confidence=0.78
        )
    
    def _generate_conservative_lineup(self) -> LineupSuggestion:
        """Generate a conservative lineup"""
        sorted_players = sorted(
            self.players_db,
            key=lambda p: (p.consistency * 0.6 + (p.recent_performance / 50) * 0.4),
            reverse=True
        )
        
        lineup = []
        positions_filled = set()
        
        for player in sorted_players:
            if player.position not in positions_filled:
                lineup.append(player)
                positions_filled.add(player.position)
                if len(lineup) == 5:
                    break
        
        expected_score = sum(p.recent_performance * p.consistency for p in lineup)
        
        return LineupSuggestion(
            players=lineup,
            expected_score=expected_score,
            risk_level="Low",
            reasoning="Safe lineup focused on consistent, reliable performers",
            confidence=0.85
        )
    
    def _generate_aggressive_lineup(self) -> LineupSuggestion:
        """Generate an aggressive lineup"""
        sorted_players = sorted(
            self.players_db,
            key=lambda p: (p.trend * 2 + p.recent_performance * 0.5 + p.nft_value * 0.3),
            reverse=True
        )
        
        lineup = []
        positions_filled = set()
        
        for player in sorted_players:
            if player.position not in positions_filled:
                lineup.append(player)
                positions_filled.add(player.position)
                if len(lineup) == 5:
                    break
        
        potential_score = sum(p.recent_performance * (1 + p.trend * 0.5) for p in lineup)
        
        return LineupSuggestion(
            players=lineup,
            expected_score=potential_score,
            risk_level="High",
            reasoning="High-risk lineup with breakout potential and trending players",
            confidence=0.65
        )
    
    def update_preference(self, key: str, value):
        """Update user preference"""
        if key in self.user_preferences:
            self.user_preferences[key] = value
            return True
        return False
    
    def get_player_info(self, player_id: int) -> Optional[Player]:
        """Get detailed player information"""
        for player in self.players_db:
            if player.id == player_id:
                return player
        return None
    
    def reset_conversation(self):
        """Reset the conversation history"""
        self.chat = self.model.start_chat(history=[])
        self.chat.send_message(self.system_context)
