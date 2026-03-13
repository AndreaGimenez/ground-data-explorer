import { PointType } from "../../types";
import "./AISuggestionModal.css";

interface AISuggestionModalProps {
  suggestion: {
    type: PointType;
    confidence: "high" | "medium" | "low";
    explanation: string;
    location: string;
  };
  onAccept: () => void;
  onReject: (selectedType: PointType) => void;
  onCancel: () => void;
}

const pointTypeOptions: { value: PointType; label: string; emoji: string }[] = [
  { value: "soil", label: "Soil", emoji: "🌱" },
  { value: "water", label: "Water", emoji: "💧" },
  { value: "mineral", label: "Mineral", emoji: "💎" },
  { value: "anomaly", label: "Anomaly", emoji: "⚠️" },
];

export function AISuggestionModal({
  suggestion,
  onAccept,
  onReject,
  onCancel,
}: AISuggestionModalProps) {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "var(--color-success)";
      case "medium":
        return "var(--color-warning)";
      case "low":
        return "var(--color-danger)";
      default:
        return "var(--color-text-secondary)";
    }
  };

  const suggestedOption = pointTypeOptions.find(
    (opt) => opt.value === suggestion.type,
  );

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🤖 AI Suggestion</h2>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="suggestion-location">
            <span className="label">📍 Location:</span>
            <span className="value">{suggestion.location}</span>
          </div>

          <div className="suggestion-main">
            <div className="suggested-type">
              <span className="type-emoji">{suggestedOption?.emoji}</span>
              <span className="type-label">{suggestedOption?.label}</span>
            </div>
            <div
              className="confidence-badge"
              style={{
                backgroundColor: getConfidenceColor(suggestion.confidence),
              }}
            >
              {suggestion.confidence} confidence
            </div>
          </div>

          <div className="suggestion-explanation">
            <p>{suggestion.explanation}</p>
          </div>

          <div className="modal-actions">
            <button className="btn-primary" onClick={onAccept}>
              ✅ Accept Suggestion
            </button>
            <div className="override-section">
              <p className="override-label">Or choose a different type:</p>
              <div className="type-buttons">
                {pointTypeOptions
                  .filter((opt) => opt.value !== suggestion.type)
                  .map((option) => (
                    <button
                      key={option.value}
                      className="btn-type"
                      onClick={() => onReject(option.value)}
                    >
                      {option.emoji} {option.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
