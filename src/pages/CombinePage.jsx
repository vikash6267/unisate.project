import React from "react";
import MagicEden from "./MagicEden";
import Home from "./Home";

function CombinedPage() {
 
  return (
    <div className="min-h-screen bg-gray-100 grid grid-cols-2">
  <MagicEden />
  <Home />
    </div>
  );
}

export default CombinedPage;
