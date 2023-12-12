import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';

const DrawingComponent = ({ imageUrl, onSave }) => {
  const [lines, setLines] = useState([]);
  const [text, setText] = useState('');
  const stageRef = useRef();
  const [tool, setTool] = useState('');
  const mainLayer = new window.Konva.Layer();
  const [draw, setDraw] = useState(false);



  useEffect(() => {
    if (imageUrl) {
      const image = new window.Image();
      image.src = imageUrl;
      image.onload = () => {
        const stage = stageRef.current;
        const layer = new window.Konva.Layer();
        const konvaImage = new window.Konva.Image({
          image,
          width: stage.width(),
          height: stage.height(),
        });
        
        const drawingLayer = new window.Konva.Layer();
  
        let isDrawing = false;
        let lastLine;
  
        stage.on('mousedown touchstart', () => {
          //if(!draw) return;
          isDrawing = true;
          const pos = stage.getPointerPosition();
          lastLine = new window.Konva.Line({
            stroke: 'red',
            strokeWidth: 5,
            globalCompositeOperation: 'source-over',
            points: [pos.x, pos.y],
          });
          drawingLayer.add(lastLine);
        });
  
        stage.on('mouseup touchend', () => {
          //if(!draw) return;
          isDrawing = false;
        });
  
        stage.on('mousemove touchmove', () => {
          if (!isDrawing) {
            return;
          }
          const pos = stage.getPointerPosition();
          let newPoints = lastLine.points().concat([pos.x, pos.y]);
          lastLine.points(newPoints);
          drawingLayer.batchDraw();
        });
  
        layer.add(konvaImage);
        stage.add(layer);
        stage.add(drawingLayer);
        stage.batchDraw();
      };
    }
  }, [imageUrl]);

  const handleText = () => {
    if (!stageRef.current) return;
    
    //setTool('text');

    const userInput = prompt('Enter text:');
    if (!userInput) return;

    const textNode = new window.Konva.Text({
      x: 50,
      y: 80,
      text: userInput,
      fontSize: 30,
      draggable: true,
    });
  
    mainLayer.add(textNode);
    stageRef.current.add(mainLayer);
    stageRef.current.draw();
  };

  const handlePencil = () => {
    if (!stageRef.current) return;

    //setDraw(true);
  }

  const handleSave = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL();
    onSave(dataURL);
  }

  return (
    <div>
      <div>
        <button onClick={handlePencil}>Pencil</button>
        <button onClick={handleText}>Text</button>
      </div>
      <Stage
        width={500}
        height={500}
        ref={stageRef}
      >
        <Layer className="image-layer">
          {lines.map((line, i) => (
            <Rect
              key={i}
              x={line.x}
              y={line.y}
              width={5}
              height={5}
              fill="black"
              draggable
            />
          ))}
        </Layer>
      </Stage>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default DrawingComponent;
