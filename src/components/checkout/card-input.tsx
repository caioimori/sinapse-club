"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ----------------------------- Helpers ------------------------------ */

function onlyDigits(value: string): string {
  return value.replace(/\D+/g, "");
}

function formatCardNumber(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
  const digits = onlyDigits(raw).slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidCardNumber(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length >= 13 && digits.length <= 19;
}

function isValidExpiry(value: string): boolean {
  const m = value.match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = Number(m[2]);
  if (month < 1 || month > 12) return false;
  // bound year to a sane window (current year .. +30)
  const currentYear = new Date().getFullYear() % 100;
  return year >= currentYear && year <= currentYear + 30;
}

function isValidCvc(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length >= 3 && digits.length <= 4;
}

/* --------------------------- Base Field ----------------------------- */

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  touched: boolean;
  onTouch: () => void;
  error?: string;
  className?: string;
  inputClassName?: string;
  /** Pass-through props for the underlying <Input> */
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "id" | "value" | "onChange" | "onBlur"
  >;
}

function Field({
  id,
  label,
  value,
  onChange,
  touched,
  onTouch,
  error,
  className,
  inputClassName,
  inputProps,
}: FieldProps) {
  const showError = touched && Boolean(error);
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onTouch}
        aria-invalid={showError || undefined}
        className={cn("h-12 text-[15px]", inputClassName)}
        {...inputProps}
      />
      {showError && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  );
}

/* ------------------------- Card Number ------------------------------ */

export interface CardNumberInputProps {
  value: string;
  onChange: (next: string) => void;
  touched: boolean;
  onTouch: () => void;
  disabled?: boolean;
}

export function CardNumberInput({
  value,
  onChange,
  touched,
  onTouch,
  disabled,
}: CardNumberInputProps) {
  const formatted = formatCardNumber(value);
  const valid = isValidCardNumber(value);
  return (
    <Field
      id="cc-number"
      label="Número do cartão"
      value={formatted}
      onChange={(next) => onChange(formatCardNumber(next))}
      touched={touched}
      onTouch={onTouch}
      error={!valid ? "Número inválido." : undefined}
      inputClassName="font-mono tracking-[0.04em]"
      inputProps={{
        type: "text",
        inputMode: "numeric",
        autoComplete: "cc-number",
        placeholder: "1234 5678 9012 3456",
        maxLength: 23,
        disabled,
      }}
    />
  );
}

/* --------------------------- Expiry --------------------------------- */

export interface CardExpiryInputProps {
  value: string;
  onChange: (next: string) => void;
  touched: boolean;
  onTouch: () => void;
  disabled?: boolean;
}

export function CardExpiryInput({
  value,
  onChange,
  touched,
  onTouch,
  disabled,
}: CardExpiryInputProps) {
  const formatted = formatExpiry(value);
  const valid = isValidExpiry(formatted);
  return (
    <Field
      id="cc-exp"
      label="Validade"
      value={formatted}
      onChange={(next) => onChange(formatExpiry(next))}
      touched={touched}
      onTouch={onTouch}
      error={!valid ? "Use MM/AA." : undefined}
      inputClassName="font-mono tracking-[0.04em]"
      inputProps={{
        type: "text",
        inputMode: "numeric",
        autoComplete: "cc-exp",
        placeholder: "MM/AA",
        maxLength: 5,
        disabled,
      }}
    />
  );
}

/* ----------------------------- CVC ---------------------------------- */

export interface CardCvcInputProps {
  value: string;
  onChange: (next: string) => void;
  touched: boolean;
  onTouch: () => void;
  disabled?: boolean;
}

export function CardCvcInput({
  value,
  onChange,
  touched,
  onTouch,
  disabled,
}: CardCvcInputProps) {
  const cleaned = onlyDigits(value).slice(0, 4);
  const valid = isValidCvc(cleaned);
  return (
    <Field
      id="cc-cvc"
      label="CVV"
      value={cleaned}
      onChange={(next) => onChange(onlyDigits(next).slice(0, 4))}
      touched={touched}
      onTouch={onTouch}
      error={!valid ? "3 ou 4 dígitos." : undefined}
      inputClassName="font-mono tracking-[0.04em]"
      inputProps={{
        type: "text",
        inputMode: "numeric",
        autoComplete: "cc-csc",
        placeholder: "123",
        maxLength: 4,
        disabled,
      }}
    />
  );
}

/* -------------------------- Validators ------------------------------ */

export const cardValidators = {
  isValidCardNumber,
  isValidExpiry,
  isValidCvc,
};
