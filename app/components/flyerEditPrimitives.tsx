"use client";

import { useEffect, useRef, useState } from "react";

type AutoSizeTextareaProps = {
  ariaLabel: string;
  className: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function AutoSizeTextarea({
  ariaLabel,
  className,
  onChange,
  placeholder,
  value,
}: AutoSizeTextareaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      className={className}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={1}
      value={value}
    />
  );
}

type EditableFieldProps = {
  ariaLabel: string;
  className: string;
  deleteLabel: string;
  emptyLabel?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
  placeholder?: string;
  value: string;
};

export function EditableField({
  ariaLabel,
  className,
  deleteLabel,
  emptyLabel,
  multiline = false,
  onChange,
  onDelete,
  placeholder,
  value,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setDraftValue(value);
    }
  }, [isEditing, value]);

  const startEditing = () => {
    setDraftValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(draftValue);
    setIsEditing(false);
  };

  const isEmpty = value.trim().length === 0;

  if (!isEditing && isEmpty) {
    return (
      <button
        aria-label={emptyLabel || `Add ${ariaLabel}`}
        className="flyer-edit-add"
        onClick={startEditing}
        type="button"
      >
        +
      </button>
    );
  }

  if (!isEditing) {
    return (
      <div className="flyer-edit-block">
        <button
          aria-label={`${ariaLabel}. Click to edit.`}
          className={`flyer-edit-display ${className}`}
          onClick={startEditing}
          type="button"
        >
          {value}
        </button>
      </div>
    );
  }

  return (
    <div className="flyer-edit-block flyer-edit-block-active">
      {multiline ? (
        <AutoSizeTextarea
          ariaLabel={ariaLabel}
          className={`flyer-edit-field flyer-edit-textarea ${className}`}
          onChange={setDraftValue}
          placeholder={placeholder}
          value={draftValue}
        />
      ) : (
        <input
          aria-label={ariaLabel}
          className={`flyer-edit-field ${className}`}
          onChange={(event) => setDraftValue(event.target.value)}
          placeholder={placeholder}
          value={draftValue}
        />
      )}
      <div className="flyer-edit-inline-actions">
        <button
          aria-label={`Save ${ariaLabel}`}
          className="flyer-edit-icon flyer-edit-save"
          onClick={handleSave}
          type="button"
        >
          ✓
        </button>
        <button
          aria-label={deleteLabel}
          className="flyer-edit-icon flyer-edit-trash"
          onClick={() => {
            onDelete();
            setIsEditing(false);
          }}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
}
