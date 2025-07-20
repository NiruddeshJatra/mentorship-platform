import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number[];
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

export const NeuralNetwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize nodes
    const initNodes = () => {
      const nodeCount = 25;
      const newNodes: Node[] = [];
      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < nodeCount; i++) {
        newNodes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 3 + 2,
          connections: []
        });
      }

      // Create connections
      const newConnections: Connection[] = [];
      newNodes.forEach((node, i) => {
        newNodes.forEach((otherNode, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 150 && Math.random() > 0.8) {
              node.connections.push(j);
              newConnections.push({
                from: i,
                to: j,
                opacity: Math.random() * 0.2 + 0.05
              });
            }
          }
        });
      });

      setNodes(newNodes);
      setConnections(newConnections);
    };

    initNodes();

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw connections
      connections.forEach((connection, index) => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];

        if (fromNode && toNode) {
          // Calculate distance from mouse to connection line
          const mouseDistance = distanceToLine(
            mouseRef.current.x,
            mouseRef.current.y,
            fromNode.x,
            fromNode.y,
            toNode.x,
            toNode.y
          );

          // Increase opacity if mouse is near
          const baseOpacity = connection.opacity;
          const mouseInfluence = Math.max(0, 1 - mouseDistance / 100);
          const finalOpacity = Math.min(1, baseOpacity + mouseInfluence * 0.6);

          // Draw connection
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = `rgba(158, 100, 82, ${finalOpacity * 0.6})`; // Sage green connections
          ctx.lineWidth = 0.5 + mouseInfluence * 0.5;
          ctx.stroke();

          // Draw flowing particles
          if (mouseInfluence > 0.3) {
            const time = Date.now() * 0.002;
            const progress = (time % 1);
            const particleX = fromNode.x + (toNode.x - fromNode.x) * progress;
            const particleY = fromNode.y + (toNode.y - fromNode.y) * progress;

            ctx.beginPath();
            ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${mouseInfluence})`;
            ctx.fill();
          }
        }
      });

      // Update and draw nodes
      nodes.forEach((node, index) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= rect.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= rect.height) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(rect.width, node.x));
        node.y = Math.max(0, Math.min(rect.height, node.y));

        // Calculate mouse influence
        const mouseDistance = Math.sqrt(
          Math.pow(mouseRef.current.x - node.x, 2) +
          Math.pow(mouseRef.current.y - node.y, 2)
        );
        const mouseInfluence = Math.max(0, 1 - mouseDistance / 100);

        // Draw node
        const radius = node.radius + mouseInfluence * 3;
        const opacity = 0.6 + mouseInfluence * 0.4;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${opacity})`);
        gradient.addColorStop(1, `rgba(59, 130, 246, ${opacity * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow effect for active nodes
        if (mouseInfluence > 0.2) {
          ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, connections]);

  // Helper function to calculate distance from point to line
  const distanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (lineLength === 0) return Math.sqrt(Math.pow(px - x1, 2) + Math.pow(py - y1, 2));

    const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / Math.pow(lineLength, 2)));
    const projection = {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };

    return Math.sqrt(Math.pow(px - projection.x, 2) + Math.pow(py - projection.y, 2));
  };

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
