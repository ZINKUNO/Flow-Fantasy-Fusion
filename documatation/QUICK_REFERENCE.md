# ⚡ Quick Reference Card

## 🚀 Start Everything (3 Commands)

```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - AI Service (Optional)
cd ai && ./start_gemini.sh
```

## 🏀 Create a League (5 Steps)

1. **Connect Wallet** → Click "Connect Wallet" button
2. **Navigate** → Go to "Create League" page
3. **Fill Form** → Enter league details
4. **Submit** → Click "Create League"
5. **Approve** → Approve transaction in wallet popup

**Done!** League created in ~30 seconds.

## 🧪 Test Everything

```bash
./test_league_creation.sh
```

## 🔗 Important URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **AI Service**: http://localhost:5001
- **Flowscan**: https://testnet.flowscan.org/account/0xf474649aaa285cf5

## 📝 Example League Settings

```
Name: "NBA Finals Fantasy"
Description: "Compete with Top Shot moments"
Start: 1 hour from now
End: 24 hours from now
Min Players: 4
Max Players: 20
Entry Fee: 10 FLOW
Max Stake: 1000 FLOW
Allow NFTs: ✓
```

## 🐛 Quick Fixes

| Problem | Solution |
|---------|----------|
| Backend not running | `cd backend && npm start` |
| Frontend not running | `cd frontend && npm run dev` |
| Wallet not connected | Click "Connect Wallet" |
| Transaction failed | Check FLOW balance |
| AI not working | `cd ai && ./start_gemini.sh` |

## 📚 Documentation

- **League Creation**: `LEAGUE_CREATION_GUIDE.md`
- **AI Integration**: `GEMINI_INTEGRATION.md`
- **Fixes Summary**: `FIXES_SUMMARY.md`
- **Architecture**: `ARCHITECTURE.md`
- **Quick Start AI**: `QUICK_START_AI.md`

## ✅ Pre-Demo Checklist

- [ ] Backend running (port 3001)
- [ ] Frontend running (port 3000)
- [ ] Wallet connected
- [ ] Test league created
- [ ] AI service running (optional)
- [ ] Demo script ready

## 🎯 Key Features to Show

1. **AI Chat** - Natural language lineup suggestions
2. **League Creation** - On-chain league deployment
3. **Wallet Integration** - Flow wallet connection
4. **Smart Contracts** - Cadence 1.0 contracts
5. **Automated Settlement** - Forte scheduled transactions

## 💡 Demo Script (2 Minutes)

**Minute 1**:
- Show AI chat interface
- Ask for lineup suggestion
- Highlight visual preview

**Minute 2**:
- Create a league
- Show wallet approval
- Verify on Flowscan

## 🏆 Judging Highlights

- ✅ **Technology**: Gemini AI + Flow + Forte
- ✅ **Originality**: First AI-powered fantasy on Flow
- ✅ **UX**: Beautiful chat interface
- ✅ **Completion**: Fully functional end-to-end

## 📞 Emergency Contacts

**If something breaks**:
1. Check console logs (F12)
2. Run `./test_league_creation.sh`
3. Restart services
4. Check documentation

## 🎉 You're Ready!

Everything is set up and working. Good luck with your demo! 🚀
