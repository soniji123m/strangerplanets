// This script updates the #planetNameTop div with the current planet name (seedString)
export function updatePlanetNameTop(name, iq) {
    const el = document.getElementById('planetNameTop');
    if (el) {
        el.innerHTML = '<div style="display:block;">' + name + '</div><div style="display:block; margin-top:0.5em; font-size:0.95em; letter-spacing:1.2px; color: var(--neon-cyan, #00ffff); text-shadow: 0 0 4px #00fff9;">iq: ' + iq + '</div>';
    }
}
