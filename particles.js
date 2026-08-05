particlesJS("particles-js", {
  particles: {
    number: {
      value: 45,
      density: {
        enable: true,
        value_area: 800
      }
    },

    color: {
      value: ["#3FBFAE", "#F5A623"]
    },

    shape: {
      type: "circle"
    },

    opacity: {
      value: 0.4,
      random: false
    },

    size: {
      value: 3,
      random: true
    },

    line_linked: {
      enable: true,
      distance: 150,
      color: "#3FBFAE",
      opacity: 0.25,
      width: 1
    },

    move: {
      enable: true,
      speed: 1.6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },

  interactivity: {
    detect_on: "canvas",

    events: {
      onhover: {
        enable: true,
        mode: "grab"
      },

      onclick: {
        enable: true,
        mode: "push"
      },

      resize: true
    },

    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.6
        }
      },

      push: {
        particles_nb: 4
      }
    }
  },

  retina_detect: true
});