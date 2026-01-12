// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Settings, Gift, Home, Scan, Plus } from 'lucide-react';

// export default function RedesignedOneHandedMenu() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [hand, setHand] = useState('center'); // Options: 'left', 'right', 'center'
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   // Position Logic
//   const getLayout = () => {
//     if (hand === 'right') {
//       return {
//         anchor: { bottom: '20px', right: '20px', left: 'auto' },
//         qr: { x: -20, y: -20 },
//         items: [
//           { icon: <Settings size={28} />, x: -40, y: -200 },
//           { icon: <Gift size={28} />, x: -140, y: -160 },
//           { icon: <Home size={28} />, x: -210, y: -60 },
//         ]
//       };
//     } else if (hand === 'left') {
//       return {
//         anchor: { bottom: '20px', left: '20px', right: 'auto' },
//         qr: { x: 20, y: -20 },
//         items: [
//           { icon: <Settings size={28} />, x: 40, y: -200 },
//           { icon: <Gift size={28} />, x: 140, y: -160 },
//           { icon: <Home size={28} />, x: 210, y: -60 },
//         ]
//       };
//     } else {
//       // CENTER MODE: Fan out in a semi-circle above the center
//       return {
//         anchor: { bottom: '20px', left: '50%', right: 'auto', transform: 'translateX(-50%)' },
//         qr: { x: 0, y: -20 },
//         items: [
//           { icon: <Settings size={28} />, x: -110, y: -130 }, // Top-Left
//           { icon: <Gift size={28} />, x: 0, y: -180 },       // Straight Up
//           { icon: <Home size={28} />, x: 110, y: -130 },     // Top-Right
//         ]
//       };
//     }
//   };

//   const layout = getLayout();

//   return (
//     <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
//       {/* Background Dimmer */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             onClick={() => setIsOpen(false)}
//             style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 5 }}
//           />
//         )}
//       </AnimatePresence>

//       {/* MENU CONTAINER */}
//       <div style={{
//         position: 'fixed',
//         zIndex: 10,
//         pointerEvents: 'none',
//         ...layout.anchor
//       }}>
        
//         <AnimatePresence>
//           {isOpen && (
//             <div style={{ position: 'relative', pointerEvents: 'auto' }}>
              
//               {/* SMALLER CIRCLES */}
//               {layout.items.map((item, index) => (
//                 <motion.button
//                   key={index}
//                   initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
//                   animate={{ x: item.x, y: item.y, scale: 1, opacity: 1 }}
//                   exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
//                   style={{
//                     position: 'absolute', bottom: 0, left: hand === 'center' ? -35 : (hand === 'left' ? 0 : 'auto'), right: hand === 'right' ? 0 : 'auto',
//                     width: '70px', height: '70px', borderRadius: '50%',
//                     backgroundColor: '#ff2d17', color: 'white', border: 'none',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//                   }}
//                 >
//                   {item.icon}
//                 </motion.button>
//               ))}

//               {/* LARGE SCAN BUTTON (The Hub) */}
//               <motion.button
//                 initial={{ scale: 0 }}
//                 animate={{ x: layout.qr.x, y: layout.qr.y, scale: 1, x: hand === 'center' ? -55 : layout.qr.x }}
//                 exit={{ scale: 0 }}
//                 transition={{ type: "spring", stiffness: 250, damping: 20 }}
//                 style={{
//                   position: 'absolute', bottom: 0, left: hand === 'left' ? 0 : 'auto', right: hand === 'right' ? 0 : 'auto',
//                   width: '110px', height: '110px', borderRadius: '50%',
//                   backgroundColor: '#ff2d17', color: 'white', border: 'none',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
//                 }}
//               >
//                 <Scan size={48} strokeWidth={2.5} />
//               </motion.button>
//             </div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* MAIN TRIGGER (Toggle Button) */}
//       <div style={{ 
//         position: 'fixed', 
//         bottom: '20px', 
//         ...(hand === 'left' ? { left: '20px' } : hand === 'right' ? { right: '20px' } : { left: '50%', transform: 'translateX(-50%)' }),
//         zIndex: 40 
//       }}>
//         {!isOpen && (
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             onClick={() => setIsOpen(true)}
//             style={{
//               width: '70px', height: '70px', borderRadius: '50%',
//               backgroundColor: '#ff2d17', color: 'white', border: 'none',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 4px 15px rgba(255, 45, 23, 0.4)', cursor: 'pointer'
//             }}
//           >
//             <Plus size={35} />
//           </motion.button>
//         )}
//       </div>

//       {/* Hand Switcher Controls */}
//       <div style={{ position: 'absolute', top: 20, width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
//         <button onClick={() => setHand('left')} style={{...btnStyle, border: hand === 'left' ? '2px solid red' : '1px solid #ccc'}}>Left</button>
//         <button onClick={() => setHand('center')} style={{...btnStyle, border: hand === 'center' ? '2px solid red' : '1px solid #ccc'}}>Center</button>
//         <button onClick={() => setHand('right')} style={{...btnStyle, border: hand === 'right' ? '2px solid red' : '1px solid #ccc'}}>Right</button>
//       </div>
//     </div>
//   );
// }

// const btnStyle = { padding: '8px 16px', borderRadius: '20px', background: 'white', cursor: 'pointer' };

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Gift, Home, Scan, Plus } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function RedesignedOneHandedMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [hand, setHand] = useState('center'); // Options: 'left', 'right', 'center'
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
  setMounted(true);

  // Load hand position from localStorage (set in settings/page.js)
  const savedHand = localStorage.getItem("handPosition");
  if (savedHand === "left" || savedHand === "center" || savedHand === "right") {
    setHand(savedHand);
  }
}, []);


  // Position Logic
  const getLayout = () => {
    if (hand === 'right') {
      return {
        anchor: { bottom: '20px', right: '20px', left: 'auto' },
        qr: { x: -20, y: -20 },
        items: [
          { icon: <Settings size={28} />, x: -40, y: -200, path: "/settings" },
          { icon: <Gift size={28} />, x: -140, y: -160, path: "/profile" },
          { icon: <Home size={28} />, x: -210, y: -60, path: "/" },
        ]
      };
    } else if (hand === 'left') {
      return {
        anchor: { bottom: '20px', left: '20px', right: 'auto' },
        qr: { x: 20, y: -20 },
        items: [
          { icon: <Settings size={28} />, x: 40, y: -200, path: "/settings" },
          { icon: <Gift size={28} />, x: 140, y: -160, path: "/profile" },
          { icon: <Home size={28} />, x: 210, y: -60, path: "/" },
        ]
      };
    } else {
      // CENTER MODE
      return {
        anchor: { bottom: '20px', left: '50%', right: 'auto', transform: 'translateX(-50%)' },
        qr: { x: 0, y: -20 },
        items: [
          { icon: <Settings size={28} />, x: -110, y: -130, path: "/settings" },
          { icon: <Gift size={28} />, x: 0, y: -180, path: "/profile" },
          { icon: <Home size={28} />, x: 110, y: -130, path: "/" },
        ]
      };
    }
  };

  const layout = getLayout();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Background Dimmer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 5 }}
          />
        )}
      </AnimatePresence>

      {/* MENU CONTAINER */}
      <div style={{
        position: 'fixed',
        zIndex: 10,
        pointerEvents: 'none',
        ...layout.anchor
      }}>
        
        <AnimatePresence>
          {isOpen && (
            <div style={{ position: 'relative', pointerEvents: 'auto' }}>
              
              {/* SMALLER CIRCLES */}
              {layout.items.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setIsOpen(false);
                    router.push(item.path);
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: item.x, y: item.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: hand === 'center' ? -35 : (hand === 'left' ? 0 : 'auto'),
                    right: hand === 'right' ? 0 : 'auto',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    backgroundColor: '#ff2d17',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  {item.icon}
                </motion.button>
              ))}

              {/* LARGE SCAN BUTTON */}
              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/scan");
                }}
                initial={{ scale: 0 }}
                animate={{ x: layout.qr.x, y: layout.qr.y, scale: 1, x: hand === 'center' ? -55 : layout.qr.x }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: hand === 'left' ? 0 : 'auto',
                  right: hand === 'right' ? 0 : 'auto',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  backgroundColor: '#ff2d17',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                }}
              >
                <Scan size={48} strokeWidth={2.5} />
              </motion.button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN TRIGGER */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        ...(hand === 'left' ? { left: '20px' } : hand === 'right' ? { right: '20px' } : { left: '50%', transform: 'translateX(-50%)' }),
        zIndex: 40 
      }}>
        {!isOpen && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: '#ff2d17',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 45, 23, 0.4)',
              cursor: 'pointer'
            }}
          >
            <Plus size={35} />
          </motion.button>
        )}
      </div>

      {/* Hand Switcher
      <div style={{ position: 'absolute', top: 20, width: '100%', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button onClick={() => setHand('left')} style={{...btnStyle, border: hand === 'left' ? '2px solid red' : '1px solid #ccc'}}>Left</button>
        <button onClick={() => setHand('center')} style={{...btnStyle, border: hand === 'center' ? '2px solid red' : '1px solid #ccc'}}>Center</button>
        <button onClick={() => setHand('right')} style={{...btnStyle, border: hand === 'right' ? '2px solid red' : '1px solid #ccc'}}>Right</button>
      </div> */}
    </div>
  );
}

const btnStyle = {
  padding: '8px 16px',
  borderRadius: '20px',
  background: 'white',
  cursor: 'pointer'
};
