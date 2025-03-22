import React, { useEffect, useRef, useState } from 'react';

const OwlWingVisualization = () => {
  const [tab, setTab] = useState('airfoil');
  
  // 1. Airfoil geometry data from the paper
  const generateAirfoilData = () => {
    // x/c values from 0 to 1
    const x = Array.from({length: 100}, (_, i) => i / 99);
    
    // Upper surface equation (approximated from paper)
    const yUpper = x.map(val => {
      if (val < 0.11) {
        // Leading edge to max thickness
        return 0.043 * Math.sin(Math.PI * val / 0.22);
      } else {
        // Max thickness to trailing edge
        return 0.043 * Math.exp(-2.5 * (val - 0.11));
      }
    });
    
    // Lower surface equation with concave shape (approximated from paper)
    const yLower = x.map(val => {
      if (val < 0.15) {
        // Leading edge part
        return -0.04 * Math.sin(Math.PI * val / 0.3);
      } else if (val < 0.5) {
        // Concave mid-section
        return -0.04 * Math.sin(Math.PI/2 + Math.PI * (val - 0.15) / 0.7);
      } else {
        // Trailing edge
        return -0.04 * Math.exp(-3 * (val - 0.5));
      }
    });
    
    return { x, yUpper, yLower };
  };
  
  // 2. Lift-to-drag data from Figure 10
  const liftDragData = {
    angles: [0, 1.5, 3, 4.5, 6, 7.5, 9],
    bionicAirfoil: [8, 10, 14, 15.3, 15.5, 14.8, 13.5],
    nacaAirfoil: [0, 4.2, 7.5, 9.3, 10.2, 8.5, 7.8]
  };
  
  // 3. Flow separation data from the paper
  const separationData = [
    { angle: 0, pressureSide: { start: 0.15, end: 0.71 }, suctionSide: { start: 0.92, end: 1.0 } },
    { angle: 1.5, pressureSide: { start: 0.21, end: 0.58 }, suctionSide: { start: 0.95, end: 1.0 } },
    { angle: 3, pressureSide: null, suctionSide: { start: 0.70, end: 1.0 } },
    { angle: 4.5, pressureSide: null, suctionSide: { start: 0.60, end: 1.0 } },
    { angle: 6, pressureSide: null, suctionSide: { start: 0.42, end: 1.0 } },
    { angle: 7.5, pressureSide: null, suctionSide: { start: 0.08, end: 1.0 } },
    { angle: 9, pressureSide: null, suctionSide: { start: 0.0, end: 1.0 } }
  ];
  
  // 4. Sound directivity data (approximated from Figure 12)
  const soundDirectivityData = {
    angles: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330],
    spl: [22, 24, 26, 28, 25, 20, 5, 8, 12, 28, 25, 18] // dB
  };

  // Component to draw the airfoil
  const AirfoilProfile = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { x, yUpper, yLower } = generateAirfoilData();
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set scale and position
      const scale = 500;
      const offsetX = 50;
      const offsetY = canvas.height / 2;
      
      // Draw airfoil
      // Upper surface
      ctx.beginPath();
      ctx.moveTo(offsetX + x[0] * scale, offsetY - yUpper[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(offsetX + x[i] * scale, offsetY - yUpper[i] * scale);
      }
      
      // Continue with lower surface
      for (let i = x.length - 1; i >= 0; i--) {
        ctx.lineTo(offsetX + x[i] * scale, offsetY - yLower[i] * scale);
      }
      
      ctx.closePath();
      ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
      ctx.fill();
      
      // Draw outline
      ctx.beginPath();
      ctx.moveTo(offsetX + x[0] * scale, offsetY - yUpper[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(offsetX + x[i] * scale, offsetY - yUpper[i] * scale);
      }
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(offsetX + x[0] * scale, offsetY - yLower[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(offsetX + x[i] * scale, offsetY - yLower[i] * scale);
      }
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw reference line
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
      ctx.lineTo(offsetX + scale, offsetY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw labels
      ctx.font = '14px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Leading Edge', offsetX - 40, offsetY - 50);
      ctx.fillText('Trailing Edge', offsetX + scale - 40, offsetY - 50);
      ctx.fillText('Upper Surface (Suction Side)', offsetX + 200, offsetY - 30);
      ctx.fillText('Lower Surface (Pressure Side)', offsetX + 200, offsetY + 40);
      ctx.fillText('Concave Region', offsetX + 150, offsetY + 70);
    }, []);
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Bionic Airfoil Profile Based on Owl Wing</h3>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          className="border border-gray-300 rounded"
        />
        <div className="mt-4 text-sm">
          <p><strong>Key Characteristics:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Chord length: 24.0 mm</li>
            <li>Maximum thickness: 5.5% of chord at x/c = 0.11</li>
            <li>Deep concave lower surface improves aerodynamic performance</li>
            <li>Thin trailing edge section (thickness &lt; 3% for x/c &gt; 0.3)</li>
          </ul>
        </div>
      </div>
    );
  };

  // Component to show lift-to-drag ratio comparison
  const LiftDragRatio = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set scale and position
      const marginLeft = 60;
      const marginBottom = 40;
      const marginTop = 40;
      const marginRight = 30;
      const width = canvas.width - marginLeft - marginRight;
      const height = canvas.height - marginBottom - marginTop;
      
      // Calculate scales
      const xScale = width / 9;
      const yScale = height / 20;
      
      // Draw axes
      ctx.beginPath();
      ctx.moveTo(marginLeft, canvas.height - marginBottom);
      ctx.lineTo(marginLeft + width, canvas.height - marginBottom);
      ctx.moveTo(marginLeft, canvas.height - marginBottom);
      ctx.lineTo(marginLeft, marginTop);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // X-axis labels
      ctx.font = '12px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      liftDragData.angles.forEach(angle => {
        const x = marginLeft + angle * xScale;
        ctx.fillText(angle.toString(), x, canvas.height - marginBottom + 20);
      });
      ctx.fillText('Angle of Attack (degrees)', marginLeft + width/2, canvas.height - 10);
      
      // Y-axis labels
      ctx.textAlign = 'right';
      for (let i = 0; i <= 20; i += 5) {
        const y = canvas.height - marginBottom - i * yScale;
        ctx.fillText(i.toString(), marginLeft - 10, y + 5);
      }
      ctx.save();
      ctx.translate(20, canvas.height/2);
      ctx.rotate(-Math.PI/2);
      ctx.textAlign = 'center';
      ctx.fillText('Lift-to-Drag Ratio', 0, 0);
      ctx.restore();
      
      // Plot data - bionic airfoil
      ctx.beginPath();
      ctx.moveTo(marginLeft + liftDragData.angles[0] * xScale, 
                canvas.height - marginBottom - liftDragData.bionicAirfoil[0] * yScale);
      for (let i = 1; i < liftDragData.angles.length; i++) {
        ctx.lineTo(marginLeft + liftDragData.angles[i] * xScale, 
                  canvas.height - marginBottom - liftDragData.bionicAirfoil[i] * yScale);
      }
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Plot points - bionic airfoil
      liftDragData.angles.forEach((angle, i) => {
        const x = marginLeft + angle * xScale;
        const y = canvas.height - marginBottom - liftDragData.bionicAirfoil[i] * yScale;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      });
      
      // Plot data - NACA airfoil
      ctx.beginPath();
      ctx.moveTo(marginLeft + liftDragData.angles[0] * xScale, 
                canvas.height - marginBottom - liftDragData.nacaAirfoil[0] * yScale);
      for (let i = 1; i < liftDragData.angles.length; i++) {
        ctx.lineTo(marginLeft + liftDragData.angles[i] * xScale, 
                  canvas.height - marginBottom - liftDragData.nacaAirfoil[i] * yScale);
      }
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Plot points - NACA airfoil
      liftDragData.angles.forEach((angle, i) => {
        const x = marginLeft + angle * xScale;
        const y = canvas.height - marginBottom - liftDragData.nacaAirfoil[i] * yScale;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
      
      // Legend
      ctx.fillStyle = 'blue';
      ctx.fillRect(marginLeft + width - 120, marginTop + 10, 15, 15);
      ctx.fillStyle = 'black';
      ctx.textAlign = 'left';
      ctx.fillText('Bionic Airfoil', marginLeft + width - 100, marginTop + 22);
      
      ctx.fillStyle = 'red';
      ctx.fillRect(marginLeft + width - 120, marginTop + 35, 15, 15);
      ctx.fillStyle = 'black';
      ctx.fillText('NACA 0006', marginLeft + width - 100, marginTop + 47);
      
      // Title
      ctx.textAlign = 'center';
      ctx.font = '14px Arial';
      ctx.fillText('Lift-to-Drag Ratio Comparison', marginLeft + width/2, marginTop - 10);
    }, []);
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Lift-to-Drag Ratio Comparison</h3>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={400} 
          className="border border-gray-300 rounded"
        />
        <div className="mt-4 text-sm">
          <p><strong>Key Findings:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Maximum L/D ratio (Bionic): 15.5 at 6.0°</li>
            <li>Maximum L/D ratio (NACA0006): 10.2 at 6.0°</li>
            <li>Performance improvement: 52.0%</li>
            <li>The bionic airfoil maintains higher L/D across all angles of attack</li>
            <li>The concave lower surface contributes to improved aerodynamic performance</li>
          </ul>
        </div>
      </div>
    );
  };

  // Component to show flow separation visualization
  const FlowSeparation = () => {
    const canvasRef = useRef(null);
    const [selectedAngle, setSelectedAngle] = useState(6);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const { x, yUpper, yLower } = generateAirfoilData();
      
      // Set scale and position
      const scale = 450;
      const offsetX = 70;
      const offsetY = canvas.height / 2;
      
      // Calculate angle of attack rotation
      const angleRad = selectedAngle * Math.PI / 180;
      
      // Draw reference axes
      ctx.beginPath();
      ctx.moveTo(offsetX - 20, offsetY);
      ctx.lineTo(offsetX + scale + 50, offsetY);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw airfoil with angle of attack
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.rotate(-angleRad);
      
      // Draw airfoil outline
      ctx.beginPath();
      ctx.moveTo(x[0] * scale, -yUpper[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x[i] * scale, -yUpper[i] * scale);
      }
      for (let i = x.length - 1; i >= 0; i--) {
        ctx.lineTo(x[i] * scale, -yLower[i] * scale);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(173, 216, 230, 0.5)';
      ctx.fill();
      
      // Upper surface
      ctx.beginPath();
      ctx.moveTo(x[0] * scale, -yUpper[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x[i] * scale, -yUpper[i] * scale);
      }
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Lower surface
      ctx.beginPath();
      ctx.moveTo(x[0] * scale, -yLower[0] * scale);
      for (let i = 1; i < x.length; i++) {
        ctx.lineTo(x[i] * scale, -yLower[i] * scale);
      }
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Find current angle data
      const currentData = separationData.find(d => d.angle === selectedAngle);
      
      // Draw separation regions
      if (currentData) {
        // Suction side (upper) separation
        if (currentData.suctionSide) {
          ctx.beginPath();
          
          // Start boundary at separation point
          const startX = currentData.suctionSide.start * scale;
          const startIdx = Math.floor(currentData.suctionSide.start * (x.length - 1));
          const startY = -yUpper[startIdx] * scale;
          
          // End boundary at trailing edge
          const endX = currentData.suctionSide.end * scale;
          const endIdx = Math.floor(currentData.suctionSide.end * (x.length - 1));
          const endY = -yUpper[endIdx] * scale;
          
          // Define the bubble shape
          ctx.moveTo(startX, startY);
          
          // Create a curved separation bubble
          const bubbleHeight = 0.1 * scale;
          const bubbleMidX = (startX + endX) / 2;
          const controlX1 = startX + (bubbleMidX - startX) * 0.3;
          const controlY1 = startY - bubbleHeight * 0.7;
          const controlX2 = bubbleMidX + (endX - bubbleMidX) * 0.3;
          const controlY2 = endY - bubbleHeight * 0.3;
          
          ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
          
          // Close the path along the airfoil surface
          for (let i = endIdx; i >= startIdx; i--) {
            ctx.lineTo(x[i] * scale, -yUpper[i] * scale);
          }
          
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
          ctx.fill();
          
          // Draw swirling eddies in the separation region
          const eddyCount = Math.floor((currentData.suctionSide.end - currentData.suctionSide.start) * 5);
          for (let i = 0; i < eddyCount; i++) {
            const eddyX = startX + (endX - startX) * (i + 0.5) / eddyCount;
            const baseY = -yUpper[Math.floor(((i + 0.5) / eddyCount) * (endIdx - startIdx) + startIdx)] * scale;
            const eddyY = baseY - bubbleHeight * 0.4;
            const eddyRadius = bubbleHeight * 0.15;
            
            ctx.beginPath();
            ctx.arc(eddyX, eddyY, eddyRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(200, 0, 0, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw swirl
            const swirl = 2.5;
            ctx.beginPath();
            ctx.moveTo(eddyX, eddyY);
            ctx.arc(eddyX, eddyY, eddyRadius * 0.7, 0, swirl * Math.PI);
            ctx.strokeStyle = 'rgba(200, 0, 0, 0.7)';
            ctx.stroke();
          }
        }
        
        // Pressure side (lower) separation
        if (currentData.pressureSide) {
          ctx.beginPath();
          
          // Start boundary at separation point
          const startX = currentData.pressureSide.start * scale;
          const startIdx = Math.floor(currentData.pressureSide.start * (x.length - 1));
          const startY = -yLower[startIdx] * scale;
          
          // End boundary at reattachment point
          const endX = currentData.pressureSide.end * scale;
          const endIdx = Math.floor(currentData.pressureSide.end * (x.length - 1));
          const endY = -yLower[endIdx] * scale;
          
          // Define the bubble shape
          ctx.moveTo(startX, startY);
          
          // Create a curved separation bubble
          const bubbleHeight = 0.05 * scale;
          const bubbleMidX = (startX + endX) / 2;
          const controlX1 = startX + (bubbleMidX - startX) * 0.3;
          const controlY1 = startY + bubbleHeight * 0.7;
          const controlX2 = bubbleMidX + (endX - bubbleMidX) * 0.3;
          const controlY2 = endY + bubbleHeight * 0.3;
          
          ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
          
          // Close the path along the airfoil surface
          for (let i = endIdx; i >= startIdx; i--) {
            ctx.lineTo(x[i] * scale, -yLower[i] * scale);
          }
          
          ctx.closePath();
          ctx.fillStyle = 'rgba(100, 100, 255, 0.5)';
          ctx.fill();
          
          // Draw swirling eddies in the separation region
          const eddyCount = Math.floor((currentData.pressureSide.end - currentData.pressureSide.start) * 3);
          for (let i = 0; i < eddyCount; i++) {
            const eddyX = startX + (endX - startX) * (i + 0.5) / eddyCount;
            const baseY = -yLower[Math.floor(((i + 0.5) / eddyCount) * (endIdx - startIdx) + startIdx)] * scale;
            const eddyY = baseY + bubbleHeight * 0.4;
            const eddyRadius = bubbleHeight * 0.15;
            
            ctx.beginPath();
            ctx.arc(eddyX, eddyY, eddyRadius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(0, 0, 200, 0.7)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw swirl
            const swirl = 2.5;
            ctx.beginPath();
            ctx.moveTo(eddyX, eddyY);
            ctx.arc(eddyX, eddyY, eddyRadius * 0.7, 0, swirl * Math.PI);
            ctx.strokeStyle = 'rgba(0, 0, 200, 0.7)';
            ctx.stroke();
          }
        }
      }
      
      ctx.restore();
      
      // Add flow direction arrows
      ctx.beginPath();
      ctx.moveTo(40, offsetY);
      ctx.lineTo(60, offsetY);
      ctx.lineTo(55, offsetY - 5);
      ctx.moveTo(60, offsetY);
      ctx.lineTo(55, offsetY + 5);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Labels
      ctx.font = '14px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Flow Direction', 30, offsetY - 15);
      ctx.fillText(`Angle of Attack: ${selectedAngle}°`, canvas.width - 150, 30);
      
      if (currentData) {
        if (currentData.suctionSide) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
          ctx.fillText('Separation Region', offsetX + scale/2, offsetY - 80);
        }
        
        if (currentData.pressureSide) {
          ctx.fillStyle = 'rgba(0, 0, 255, 0.7)';
          ctx.fillText('Separation Bubble', offsetX + scale/3, offsetY + 80);
        }
      }
    }, [selectedAngle]);
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Flow Separation Visualization</h3>
        <div className="mb-4">
          <label className="mr-2">Angle of Attack:</label>
          <select 
            value={selectedAngle} 
            onChange={(e) => setSelectedAngle(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {separationData.map(data => (
              <option key={data.angle} value={data.angle}>{data.angle}°</option>
            ))}
          </select>
        </div>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={320} 
          className="border border-gray-300 rounded"
        />
        <div className="mt-4 text-sm">
          <p><strong>Flow Separation Characteristics at {selectedAngle}°:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            {selectedAngle <= 1.5 ? (
              <>
                <li>Separation occurs on the pressure side (lower surface) due to the deep concave profile</li>
                <li>Small separation at the trailing edge of the suction side</li>
              </>
            ) : selectedAngle <= 3 ? (
              <>
                <li>Transition point: Separation shifts from pressure side to suction side</li>
                <li>Separation begins at ~70% chord on the suction side</li>
              </>
            ) : (
              <>
                <li>Separation on the suction side increases with angle of attack</li>
                <li>At 9°, complete separation from the leading edge on the suction side</li>
                <li>Multiple eddies form in the separation region</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // Component to show acoustic characteristics
  const AcousticCharacteristics = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set polar plot center and radius
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 50;
      
      // Draw concentric circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * i / 5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add SPL labels
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${i * 5} dB`, centerX - 5, centerY - radius * i / 5);
      }
      
      // Draw radial lines
      for (let i = 0; i < 12; i++) {
        const angle = i * Math.PI / 6;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY - Math.sin(angle) * radius
        );
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Add angle labels
        const labelRadius = radius + 15;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          `${i * 30}°`,
          centerX + Math.cos(angle) * labelRadius,
          centerY - Math.sin(angle) * labelRadius
        );
      }
      
      // Plot sound directivity
      ctx.beginPath();
      
      // Convert to radians and scale
      const angles = soundDirectivityData.angles.map(angle => angle * Math.PI / 180);
      const scaled = soundDirectivityData.spl.map(spl => spl / 30 * radius); // Scale to fit
      
      // Start at first point
      ctx.moveTo(
        centerX + Math.cos(angles[0]) * scaled[0],
        centerY - Math.sin(angles[0]) * scaled[0]
      );
      
      // Connect all points
      for (let i = 1; i < angles.length; i++) {
        ctx.lineTo(
          centerX + Math.cos(angles[i]) * scaled[i],
          centerY - Math.sin(angles[i]) * scaled[i]
        );
      }
      
      // Close the path
      ctx.lineTo(
        centerX + Math.cos(angles[0]) * scaled[0],
        centerY - Math.sin(angles[0]) * scaled[0]
      );
      
      ctx.fillStyle = 'rgba(30, 144, 255, 0.3)';
      ctx.fill();
      
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw receiving points
      angles.forEach((angle, i) => {
        ctx.beginPath();
        ctx.arc(
          centerX + Math.cos(angle) * scaled[i],
          centerY - Math.sin(angle) * scaled[i],
          4, 0, 2 * Math.PI
        );
        ctx.fillStyle = 'blue';
        ctx.fill();
      });
      
      // Draw airfoil at center
      const airfoilScale = radius * 0.1;
      ctx.save();
      ctx.translate(centerX, centerY);
      
      // Draw simplified airfoil shape
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        airfoilScale * 0.3, -airfoilScale * 0.1,
        airfoilScale * 0.7, -airfoilScale * 0.1,
        airfoilScale, 0
      );
      ctx.bezierCurveTo(
        airfoilScale * 0.7, airfoilScale * 0.1,
        airfoilScale * 0.3, airfoilScale * 0.1,
        0, 0
      );
      ctx.fillStyle = 'black';
      ctx.fill();
      
      ctx.restore();
      
      // Title
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Sound Pressure Level (SPL) Directivity Pattern', centerX, 20);
      ctx.font = '12px Arial';
      ctx.fillText('(Based on Figure 12 in the paper)', centerX, 40);
    }, []);
    
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Acoustic Characteristics</h3>
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={450} 
          className="border border-gray-300 rounded mx-auto"
        />
        <div className="mt-4 text-sm">
          <p><strong>Key Acoustic Findings:</strong></p>
          <ul className="list-disc pl-5 mt-2">
            <li>Sound pressure levels (SPL) range from 3.9 dB to 28.3 dB (average 21.7 dB)</li>
            <li>Peak SPL of ~22.6 dB occurs at frequency of ~192 Hz</li>
            <li>Directivity pattern shows characteristics of dipole sources</li>
            <li>Maximum pressure fluctuations (dP/dt) occur at the trailing edge</li>
            <li>Low frequency noise dominates at Reynolds number of 12,300</li>
            <li>Sound field is strongly influenced by the eddies in the separation region</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Bionic Owl Wing Airfoil Analysis</h2>
      
      <div className="flex mb-4 border-b">
        <button 
          className={`px-4 py-2 ${tab === 'airfoil' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('airfoil')}
        >
          Airfoil Geometry
        </button>
        <button 
          className={`px-4 py-2 ${tab === 'liftdrag' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('liftdrag')}
        >
          Lift-Drag Ratio
        </button>
        <button 
          className={`px-4 py-2 ${tab === 'separation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('separation')}
        >
          Flow Separation
        </button>
        <button 
          className={`px-4 py-2 ${tab === 'acoustic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('acoustic')}
        >
          Acoustic Characteristics
        </button>
      </div>
      
      <div className="bg-white border rounded p-4">
        {tab === 'airfoil' && <AirfoilProfile />}
        {tab === 'liftdrag' && <LiftDragRatio />}
        {tab === 'separation' && <FlowSeparation />}
        {tab === 'acoustic' && <AcousticCharacteristics />}
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
        <h3 className="font-semibold">Summary of Findings:</h3>
        <p>This analysis was made by Arman Shaikh, student at Sharad Reshmi College, based on bionic airfoil research.</p>
        <ol className="list-decimal pl-5 mt-2">
          <li>The bionic airfoil based on the owl wing achieves a 52% higher lift-to-drag ratio compared to the standard NACA 0006 airfoil.</li>
          <li>The unique geometry features (particularly the deep concave lower surface) contribute to improved aerodynamic performance.</li>
          <li>Flow separation pattern changes from pressure side at low angles of attack (0-1.5°) to suction side at higher angles.</li>
          <li>Maximum sound pressure levels occur at the trailing edge, showing dipole-like directivity patterns.</li>
          <li>The noise reduction capabilities make this bionic airfoil design promising for applications in multiblade centrifugal fans.</li>
        </ol>
      </div>
    </div>
  );
};

export default OwlWingVisualization;
