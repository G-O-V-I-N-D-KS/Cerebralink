
  // Helper for button positioning (if used in control-panel)
  const getButtonClass = (index) => {
    switch (index) {
      case 0:
        return "position-1";
      case 1:
        return "position-2";
      case 2:
        return "center";
      case 3:
        return "position-4";
      case 4:
        return "position-5";
      default:
        return "";
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
