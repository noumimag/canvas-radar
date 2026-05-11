import { Application, extend } from '@pixi/react';
import { Assets, Container, Sprite, Graphics, Text, TextStyle, Texture } from 'pixi.js';
import { useState, useEffect, useCallback, useRef } from 'react';

// Extend the elements
extend({
  Container,
  Sprite,
  Graphics,
  Text
});

const BUNNY_URL = 'src/assets/images/pacman.svg';

const EntityRadar = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [texture, setTexture] = useState<Texture | null>(null);
  const textRef = useRef<Text>(null);

  // Load the sprite texture
  useEffect(() => {
    Assets.load<Texture>(BUNNY_URL).then(setTexture);
  }, []);

  // Set anchor on the text element after mount
  useEffect(() => {
    if (textRef.current) {
      textRef.current.anchor.set(0.5);
    }
  }, []);

  // Simulate WebSocket/NATS data loop
  useEffect(() => {
    let frame = requestAnimationFrame(function loop() {
      setPos(prev => ({
        x: prev.x + (Math.random() - 0.5) * 5,
        y: prev.y + (Math.random() - 0.5) * 5,
      }));
      frame = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Handle background or grid drawing
  const drawGrid = useCallback((g: Graphics) => {
    g.clear();
    g.setStrokeStyle({ width: 2, color: 0x333333 });
    g.rect(-200, -200, 400, 400);
    g.stroke();
  }, []);

  return (
    <Application width={800} height={600} background="#0a0a0a">
      <pixiContainer x={400} y={300}>
        {/* Background Grid */}
        <pixiGraphics draw={drawGrid} />

        <pixiText
          ref={textRef}
          text="LIVE RADAR"
          y={-250}
          style={new TextStyle({ fill: '#ffffff', fontSize: 28, fontWeight: 'bold', align: 'center' })}
        />

        {/* The Animated Entity */}
        {texture && (
          <pixiSprite
            texture={texture}
            x={pos.x}
            y={pos.y}
            anchor={0.5}
            scale={2}
          />
        )}
      </pixiContainer>
    </Application>
  );
};

export default EntityRadar;