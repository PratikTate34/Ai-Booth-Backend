import React, { useState, useEffect } from "react";

export default function CharacterPage({ onSelect }) {
  const defaultChars = [
    { name: "Engineer", img: "/eng.png", gender: "male" },
    { name: "Doctor", img: "/doc.png", gender: "male" },
    { name: "Lawyer", img: "/law.png", gender: "female" }
  ];

  const [chars, setChars] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("characters");
    if (saved) setChars(JSON.parse(saved));
    else {
      setChars(defaultChars);
      localStorage.setItem("characters", JSON.stringify(defaultChars));
    }
  }, []);

  const addCharacter = () => {
    const name = prompt("Character name?");
    if (!name) return;

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const newChar = {
          name,
          img: reader.result,
          gender: "male",
        };

        const updated = [...chars, newChar];
        setChars(updated);
        localStorage.setItem("characters", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    };

    fileInput.click();
  };

  return (
    <div className="screen">
      <h2>Select Character</h2>

      <div style={{display:"flex",flexWrap:"wrap",gap:"20px"}}>
        {chars.map((c,i)=>(
          <div key={i} onClick={()=>onSelect(c.name)} style={{cursor:"pointer"}}>
            <img src={c.img} width="100"/>
            <p>{c.name}</p>
          </div>
        ))}
      </div>

      <button onClick={addCharacter}>+ Add Character</button>
    </div>
  );
}
