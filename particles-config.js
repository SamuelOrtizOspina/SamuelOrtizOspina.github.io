document.addEventListener('DOMContentLoaded', () => {
           if (typeof particlesJS !== 'undefined') {
               particlesJS('particles-js', {
                   particles: {
                       number: { value: 80, density: { enable: true, value_area: 800 } },
                       color: { value: '#00e5ff' },
                       shape: { type: 'circle', stroke: { width: 0, color: '#ff00aa' } },
                       opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                       size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
                       line_linked: { enable: true, distance: 150, color: '#00e5ff', opacity: 0.4, width: 1 },
                       move: { enable: true, speed: 4, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
                   },
                   interactivity: {
                       detect_on: 'canvas',
                       events: {
                           onhover: { enable: true, mode: 'repulse' },
                           onclick: { enable: true, mode: 'push' },
                           resize: true
                       },
                       modes: {
                           repulse: { distance: 120, duration: 0.4 },
                           push: { particles_nb: 4 }
                       }
                   },
                   retina_detect: true
               });
           }
       });