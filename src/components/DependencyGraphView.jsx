import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { buildDependencyGraph } from '../analytics/analyticsEngine';

export default function DependencyGraphView({ answers }) {
  const { nodes, edges } = buildDependencyGraph(answers || {});

  return (
    <div className="dependency-graph-container glass-card">
      <div className="graph-header">
        <AlertTriangle size={18} className="text-fire-orange" />
        <h3>DEPENDENCY & ROOT-CAUSE GRAPH MODEL</h3>
      </div>

      <p className="graph-sub">
        Non-linear model demonstrating how your life habits trigger cascading academic failure.
      </p>

      {/* Nodes Grid */}
      <div className="nodes-grid">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`node-card ${node.risk ? 'node-risk' : 'node-safe'}`}
          >
            <div className="node-status">
              {node.risk ? (
                <AlertTriangle size={14} className="text-fire-red" />
              ) : (
                <CheckCircle size={14} className="text-emerald" />
              )}
              <span className="node-title">{node.label}</span>
            </div>
            <strong className="node-value">{node.value}</strong>
          </div>
        ))}
      </div>

      {/* Edges & Cascade Connections */}
      <div className="edges-section">
        <h4>IDENTIFIED CASCADE TRIGGERS ({edges.length})</h4>
        {edges.length > 0 ? (
          <div className="edges-list">
            {edges.map((edge, idx) => (
              <div key={idx} className="edge-item glass-mini-card">
                <span className="edge-node from-node">{edge.from.toUpperCase()}</span>
                <ArrowRight size={14} className="text-fire-accent" />
                <span className="edge-node to-node">{edge.to.toUpperCase()}</span>
                <span className="edge-reason">{edge.reason}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-cascade-text">
            ✨ No major negative cascades detected! Your habits are operating independently.
          </p>
        )}
      </div>
    </div>
  );
}
