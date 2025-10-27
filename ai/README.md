# Flow Fantasy Fusion - AI Service

## Overview
Rule-based AI lineup prediction service for fantasy sports optimization.

## Features
- **Rule-based scoring**: Combines player performance, market value, consistency, and trending data
- **Multiple strategies**: Balanced, high-risk, conservative optimization
- **RESTful API**: Easy integration with frontend and backend services
- **Mock data**: Simulates player stats (ready for Find Labs / Dapper API integration)

## Scoring Algorithm

```
score = α * recent_performance + β * market_value + γ * consistency + δ * trending - injury_risk

Where:
- α = 0.45 (performance weight)
- β = 0.30 (market value weight)  
- γ = 0.15 (consistency weight)
- δ = 0.10 (trending weight)
```

## Endpoints

### POST /api/ai/predict-lineup
Predict optimal lineup for a league.

**Request:**
```json
{
  "leagueId": 1,
  "playerAddress": "0x123...",
  "availablePlayers": [1, 2, 3, 4, 5],
  "positions": ["PG", "SG", "SF", "PF", "C"],
  "optimizationGoal": "balanced"
}
```

**Response:**
```json
{
  "success": true,
  "lineup": {
    "positions": {
      "PG": [1],
      "SG": [2],
      "SF": [3],
      "PF": [4],
      "C": [5]
    },
    "expectedScore": 387.45,
    "confidence": 0.82,
    "rationale": "Optimized for balanced strategy. Expected score: 387.5. 3 players trending upward."
  }
}
```

### POST /api/ai/player-analysis
Analyze individual player metrics.

## Running Locally

```bash
cd ai
pip install -r requirements.txt
python app.py
```

Service runs on `http://localhost:5000`

## Production Deployment
```bash
gunicorn --bind 0.0.0.0:5000 app:app
```

## Future Enhancements
- Integration with Find Labs API for real on-chain data
- Dapper Moments API for NBA Top Shot metadata
- Machine learning model training on historical performance
- Real-time injury and trending data feeds
