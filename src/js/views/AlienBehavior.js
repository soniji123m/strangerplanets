// AlienBehavior.js
// Generates IQ-aware, psychologically realistic alien behavior for chat

// Helper: clamp value between min and max
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// Main behavior generator
export function generateAlienBehavior({
    alienSpecies,
    alienName,
    alienIQ,
    coreMotivation,
    confidenceLevel,
    aggressionLevel,
    curiosityLevel,
    empathyLevel,
    paranoiaLevel,
    myPowerLevel,
    playerPowerLevel,
    playerReputation,
    playerLastAction,
    alliesNearby,
    territorialAdvantage,
    myResources,
    playerThreatLevel
}) {
    // 1. IQ-based patterns
    let iq = clamp(alienIQ, 10, 300);
    let iqBand = 'low';
    if (iq <= 80) iqBand = 'low';
    else if (iq <= 110) iqBand = 'avg';
    else if (iq <= 130) iqBand = 'above';
    else iqBand = 'high';

    // 2. Emotional state
    let emotion = '';
    let thought = '';
    let action = '';
    let dialogue = '';

    // Threat assessment
    let threat = playerPowerLevel - myPowerLevel + (paranoiaLevel-5)*0.5;
    if (playerReputation === 'Ruthless Killer') threat += 2;
    if (playerReputation === 'Merciful') threat -= 1;
    if (territorialAdvantage === "My territory") threat -= 1;
    if (territorialAdvantage === "Player's domain") threat += 1;
    threat = clamp(threat, -5, 10);

    // Opportunity recognition
    let opportunity = (curiosityLevel + empathyLevel - aggressionLevel + (myResources === 'Rich in trade goods' ? 2 : 0));
    // Social dynamics
    let social = (iqBand === 'high' ? 'complex' : iqBand === 'above' ? 'subtle' : iqBand === 'avg' ? 'basic' : 'poor');

    // 3. Psychological state & response (simplified, can be expanded)
    if (threat > 4) {
        // FEAR
        if (iqBand === 'low') {
            emotion = 'Panicked Fear';
            thought = "Player strong... I am weak... Must run or hide...";
            action = "Back away, hands up";
            dialogue = "Please! No hurt! Take what you want!";
        } else if (iqBand === 'avg') {
            emotion = 'Worried Submission';
            thought = "Player is stronger... Fighting is bad. Maybe I can talk out of this.";
            action = "Lower weapon, avoid eye contact";
            dialogue = "Alright, you win. What do you want from me?";
        } else if (iqBand === 'above') {
            emotion = 'Strategic Caution';
            thought = "Direct fight is risky. Maybe I can negotiate or distract them.";
            action = "Maintain distance, speak calmly";
            dialogue = "Let's not make this ugly. Surely we can work something out.";
        } else {
            emotion = 'Calculated Submission';
            thought = "Confrontation is suicide. I must appear non-threatening and useful.";
            action = "Show open palms, offer information";
            dialogue = "You've demonstrated your strength. Let's find a deal that benefits us both.";
        }
    } else if (opportunity > 12) {
        // CURIOSITY
        if (iqBand === 'low') {
            emotion = 'Simple Curiosity';
            thought = "What is that? Who is player?";
            action = "Stare, ask basic questions";
            dialogue = "You new here? What you want?";
        } else if (iqBand === 'avg') {
            emotion = 'Genuine Interest';
            thought = "Maybe player has something useful. Should ask.";
            action = "Approach, ask about player";
            dialogue = "Hey, traveler. Got anything interesting to trade?";
        } else if (iqBand === 'above') {
            emotion = 'Analytical Curiosity';
            thought = "Player may have rare info or tech. Probe gently.";
            action = "Observe, ask probing questions";
            dialogue = "You seem resourceful. What brings you to this sector?";
        } else {
            emotion = 'Strategic Interest';
            thought = "Player's presence could be leveraged for greater gain. Gather intel first.";
            action = "Smile, test boundaries with subtle questions";
            dialogue = "You move with purpose. What are you seeking here, exactly?";
        }
    } else if (aggressionLevel > 7 && threat < 2) {
        // AGGRESSION
        if (iqBand === 'low') {
            emotion = 'Hostile Aggression';
            thought = "I strong. Player weak. I take what I want!";
            action = "Threaten loudly, bare teeth";
            dialogue = "Give me your stuff! Now!";
        } else if (iqBand === 'avg') {
            emotion = 'Confident Threat';
            thought = "I have the upper hand. Player should submit.";
            action = "Step forward, glare";
            dialogue = "You don't want trouble. Hand it over.";
        } else if (iqBand === 'above') {
            emotion = 'Controlled Intimidation';
            thought = "Show strength, but don't overplay hand.";
            action = "Speak with cold confidence";
            dialogue = "This can go easy, or it can go hard. Your choice.";
        } else {
            emotion = 'Subtle Dominance';
            thought = "Project power without direct threat. Manipulate player into compliance.";
            action = "Lean in, lower voice";
            dialogue = "It would be wise to cooperate. I can be a valuable friend—or a dangerous enemy.";
        }
    } else {
        // DEFAULT/NEUTRAL
        if (iqBand === 'low') {
            emotion = 'Mild Suspicion';
            thought = "Player here. Don't know what they want... Watch close.";
            action = "Keep distance, watch";
            dialogue = "What you want?";
        } else if (iqBand === 'avg') {
            emotion = 'Cautious Neutrality';
            thought = "See what player does. No need to act yet.";
            action = "Wait, observe";
            dialogue = "Just passing through?";
        } else if (iqBand === 'above') {
            emotion = 'Measured Openness';
            thought = "No threat for now. Opportunity may arise.";
            action = "Nod, appear friendly";
            dialogue = "Welcome. Let me know if you need anything.";
        } else {
            emotion = 'Subtle Calculation';
            thought = "Every encounter is a negotiation. Gather data, stay flexible.";
            action = "Smile, analyze player";
            dialogue = "Greetings, traveler. What brings you to my domain?";
        }
    }

    return {
        EMOTIONAL_STATE: emotion,
        THOUGHT_PROCESS: thought,
        ACTION: action,
        DIALOGUE: dialogue
    };
}
