import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const colors = ["black", "red", "green", "blue", "yellow", "purple"];
  const canvasRef = useRef(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isPressed, setIsPressed] = useState(false);
  const beginDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsPressed(true);
  };
  const endDraw = () => {
    setIsPressed(false);
  };
  const updateDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPressed) return;
    const context = contextRef.current;
    if (!context) return;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const setStrokeColor = (color: string) => {
    const context = contextRef.current;
    if (context) context.strokeStyle = color;
  };

  const handleTouch = (
    e: React.TouchEvent<HTMLCanvasElement>,
    type: "start" | "move"
  ) => {
    const touch = e.touches[0];
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    if (type === "start") {
      contextRef.current?.beginPath();
      contextRef.current?.moveTo(offsetX, offsetY);
      setIsPressed(true);
    } else if (type === "move" && isPressed) {
      contextRef.current?.lineTo(offsetX, offsetY);
      contextRef.current?.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    canvas.width = 800;
    canvas.height = 800;

    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context;
    }
  }, []);
  return (
    <>
      <div className="app">
        <canvas
          ref={canvasRef}
          onMouseDown={beginDraw}
          onMouseMove={updateDraw}
          onMouseUp={endDraw}
          onTouchStart={(e) => handleTouch(e, "start")}
          onTouchMove={(e) => handleTouch(e, "move")}
          onTouchEnd={endDraw}
        ></canvas>
        <div className="tools">
          <button onClick={clearCanvas}>Clear</button>
          {colors.map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => setStrokeColor(color)}
            ></button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
