import * as THREE from 'three'
import WAGNER from '@superguigui/wagner/'
import MultiPassBloomPass from '@superguigui/wagner/src/passes/bloom/MultiPassBloomPass'
import GodrayPass from '@superguigui/wagner/src/passes/godray/godraypass'
import AbstractApplication from 'views/AbstractApplication'
import shaderVert from 'shaders/custom.vert'
import shaderFrag from 'shaders/custom.frag'
import Planet from 'views/Planet'
import RenderQueue from 'views/RenderQueue'
import { generateAlienBehavior } from './views/AlienBehavior.js';


class Main extends AbstractApplication {

    constructor(){
        super();

        // Initialize menu and renderer
        this.initializeMenu();
        
        // Initially hide the scene until menu is closed
        if (this._renderer.domElement) {
            this._renderer.domElement.style.display = 'none';
        }

        window.renderQueue = new RenderQueue();

        // Initialize game state
        
        // Start the application when exploration begins
        document.getElementById('start-exploration').addEventListener('click', () => {
            this.startExploration();
        });

        // Settings button handler
        document.getElementById('settings').addEventListener('click', () => {
            // TODO: Implement settings panel
            console.log('Settings clicked');
        });

        // Set up next planet button
        const nextPlanetBtn = document.getElementById('next-planet');
        if (nextPlanetBtn) {
            nextPlanetBtn.style.display = 'none';
            nextPlanetBtn.addEventListener('click', () => {
                // --- Warp effect injection ---
                let overlay = document.getElementById('wave-warp-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'wave-warp-overlay';
                    document.body.appendChild(overlay);
                }
                overlay.classList.remove('active');
                // Force reflow for restart
                void overlay.offsetWidth;
                overlay.classList.add('active');
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 700);
                // Switch planet after slight delay for effect
                setTimeout(() => {
                    if (this.planet) {
                        this.planet.randomize();
                        // Reset alien chat history and UI
                        window.alienChatHistory = [];
                        const chatMessages = document.getElementById('alien-chat-messages');
                        if (chatMessages) chatMessages.innerHTML = '';
                    }
                }, 200);
            });
        }

        // Also reset chat history on first load
        window.alienChatHistory = [];

    }

    initializeMenu() {
        this.mainMenu = document.getElementById('main-menu');
    }

    updateLoadingBar(progress) {
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    async startExploration() {
        // Start loading sequence
        for (let i = 0; i <= 100; i += 20) {
            this.updateLoadingBar(i);
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Initialize the scene
        if (!this.planet) {
            this.planet = new Planet();
            window.planet = this.planet;
            this.scene.add(this.planet.view);
        }

        // Hide menu and show scene
        this.mainMenu.classList.add('hidden');
        if (this._renderer.domElement) {
            this._renderer.domElement.style.display = 'block';
        }

        // Show next planet button
        const nextPlanetBtn = document.getElementById('next-planet');
        if (nextPlanetBtn) {
            nextPlanetBtn.style.display = 'block';
        }

        // Initialize post-processing if needed
        // this.initPostprocessing();
        
        // Start animation
        this.animate();
    }

    updatePlanet() {
        // Remove old planet
        if (this.planet) {
            this.scene.remove(this.planet.view);
        }

        // Create new planet
        this.planet = new Planet();
        this.scene.add(this.planet.view);
    }

    initPostprocessing() {
        this._renderer.autoClearColor = true;
        this.composer = new WAGNER.Composer(this._renderer);
        this.bloomPass = new MultiPassBloomPass({
            blurAmount: 3,
            applyZoomBlur: false
        });
        this.godrayPass = new GodrayPass();

        let folder = window.gui.addFolder("Post Processing");
        this.bloom = true;
        folder.add(this, "bloom");
        folder.add(this.bloomPass.params, "blurAmount", 0, 5);


    }

    createBrandTag() {
      let a = document.createElement("a");
      a.href = "http://www.colordodge.com";
      a.innerHTML = "<div id='brandTag'>Colordodge</div>";
      document.body.appendChild(a);
    }

    animate() {
      super.animate();

      window.renderQueue.update();
      this.planet.update();

      // if (this.bloom) {
      //   this.composer.reset();
      //   this.composer.render(this._scene, this._camera);
      //   // this.composer.pass(this.bloomPass);
      //   this.composer.pass(this.godrayPass);
      //   this.composer.toScreen();
      // }



    }

}

export default Main;

// Alien chat box logic (IQ-aware)
window.addEventListener('DOMContentLoaded', function() {
    // --- Unique per-planet alien name ---
    function getStoredMap(key) {
        try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { return {}; }
    }
    function setStoredMap(key, obj) {
        try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {}
    }
    function hashString(s) {
        let h = 2166136261 >>> 0;
        for (let i = 0; i < s.length; i++) {
            h ^= s.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }
        return h >>> 0;
    }
    function pick(arr, idx) { return arr[idx % arr.length]; }
    function generateAlienName(seed) {
        const A = ['Xa','Za','Qe','Vo','Ty','Ra','Lo','Ki','Ju','Ha','Ge','Fi','Do','Ce','Ba','Au','Ni','Or','Ul','Ym'];
        const B = ['n','rk','lz','th','sh','v','x','m','dr','g','zz','ph','tr','q','l','r'];
        const C = ['ar','en','ix','on','um','et','os','ir','an','or','un','es','a','ius'];
        const h = hashString(String(seed || Date.now()));
        const p1 = pick(A, (h >>> 0) & 0xff);
        const p2 = pick(B, (h >>> 8) & 0xff);
        const p3 = pick(C, (h >>> 16) & 0xff);
        const name = (p1 + p2 + p3).replace(/(^|[-\s])([a-z])/g, (m, p, c) => p + c.toUpperCase());
        return name;
    }
    function getOrCreateAlienNameForPlanet(planetSeed) {
        const mapKey = 'alienNameByPlanet';
        const map = getStoredMap(mapKey);
        if (planetSeed && map[planetSeed]) return map[planetSeed];
        const baseSeed = planetSeed || 'global-' + Math.random().toString(36).slice(2);
        let name = generateAlienName(baseSeed);
        // avoid duplicates across planets if possible
        const existing = new Set(Object.values(map));
        let tries = 0;
        while (existing.has(name) && tries < 5) {
            name = generateAlienName(baseSeed + '-' + tries);
            tries++;
        }
        if (planetSeed) {
            map[planetSeed] = name;
            setStoredMap(mapKey, map);
        }
        return name;
    }
    const chatInput = document.getElementById('alien-chat-input');
    const chatSend = document.getElementById('alien-chat-send');
    const chatMessages = document.getElementById('alien-chat-messages');
    if (!chatInput || !chatSend || !chatMessages) return;

    chatSend.onclick = () => {
        const msg = chatInput.value.trim();
        if (!msg) return;
        chatInput.value = '';
        // Show user message
        const userDiv = document.createElement('div');
        userDiv.textContent = 'You: ' + msg;
        userDiv.style.color = '#fff';
        chatMessages.appendChild(userDiv);

        // Show loading...
        const alienDiv = document.createElement('div');
        alienDiv.textContent = '...';
        alienDiv.style.color = 'var(--neon-cyan, #00ffff)';
        chatMessages.appendChild(alienDiv);

        // Gather planet/alien context
        const planet = window.planet;
        const alienIQ = planet && planet.iq ? planet.iq : 100;
        const planetName = planet && planet.seedString ? planet.seedString : 'Unknown';
        // Generate a unique, persistent alien name per planet
        const alienName = getOrCreateAlienNameForPlanet(planet && planet.seedString);
        // Dummy values for now (later: make dynamic or user-editable)
        const alienContext = {
            alienSpecies: 'Zylox',
            alienName: alienName,
            alienIQ: alienIQ,
            coreMotivation: 'Survival and trade',
            confidenceLevel: 5,
            aggressionLevel: 3,
            curiosityLevel: 7,
            empathyLevel: 4,
            paranoiaLevel: 2,
            myPowerLevel: 5,
            playerPowerLevel: 5,
            playerReputation: 'Unknown',
            playerLastAction: msg,
            alliesNearby: 0,
            territorialAdvantage: 'Neutral ground',
            myResources: 'Well-armed',
            playerThreatLevel: 'Moderate',
        };
        // --- Chat history memory ---
        if (!window.alienChatHistory) window.alienChatHistory = [];
        // Add user message to chat history
        window.alienChatHistory.push({ role: 'user', content: msg });
        // Compose messages array for OpenRouter
        const messages = [
            { role: "system", content: `You are a psychologically realistic alien NPC in a sci-fi game. Your name is ${alienContext.alienName}, you are a member of the species ${alienContext.alienSpecies}, and your IQ is ${alienContext.alienIQ}. The current planet's name is ${planetName}. Remember and use this planet name naturally in conversation (e.g., refer to it as ${planetName}) and keep continuity. Always roleplay as this alien. Speak in a very human, natural, and conversational way—use contractions, slang, and informal phrasing as fits the alien's IQ and mood. Be emotional, expressive, and full of personality. Never sound like a chatbot or AI. If your IQ is below 100, act as if you are seeing an alien for the first time: be curious, surprised, or confused. If your IQ is below 70, you are shocked, never having conceived of aliens before—be extremely surprised, possibly fearful or in awe. If your IQ is low, be simple, naive, or make logical mistakes; if your IQ is high, be clever, insightful, or sophisticated. Make your replies a little shorter than usual, but allow longer responses if the situation calls for it. Stay immersive, concise, and in-character.` }
        ].concat(window.alienChatHistory);
        // OpenRouter AI integration
        alienDiv.innerHTML = `<span style="color:#0ff">${alienContext.alienName} is thinking...</span>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        (async () => {
          try {
            const apiKey = "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";
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": window.location.origin,
                "X-Title": "ProceduralPlanet"
              },
              body: JSON.stringify({
                model: "meta-llama/llama-3.2-3b-instruct",
                messages: messages
              })
            });
            const data = await response.json();
            let aiReply = `${alienContext.alienName} is silent.`;
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
              aiReply = data.choices[0].message.content;
            }
            let match = aiReply.match(/^(.*?)(\[(.*?)\])?$/);
            let dialogue = match ? match[1].trim() : aiReply;
            let action = match && match[3] ? match[3].trim() : "";
            let finalReply = dialogue;
            if (action) finalReply += ` <i>*${action}*</i>`;
            alienDiv.innerHTML = finalReply;
            // Add assistant message to chat history
            window.alienChatHistory.push({ role: 'assistant', content: aiReply });
          } catch (err) {
            alienDiv.innerHTML = `<span style=\"color:red\">${alienContext.alienName} failed to respond (API error)</span>`;
            console.error(err);
          }
          chatMessages.scrollTop = chatMessages.scrollHeight;
        })();
    };
    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') chatSend.onclick();
    });
});
