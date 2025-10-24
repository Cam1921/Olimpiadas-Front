// src/application/responsables/useEditResponsible.js
import { useState, useEffect, useCallback } from "react";
import { responsablesRepo } from "../../infrastructure/http/responsables/repository"; // ✅ Ruta corregida
import { validateResponsable } from "../../domain/responsables/validators";
import { cleanNameInput, cleanPhoneInput, cleanCIInput } from "../../utils/text";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i;

export function useEditResponsible(initial, takenAreas) {
  const [form, setForm] = useState({ ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) setForm({ ...initial });
  }, [initial]);

  const setField = useCallback((key, val) => {
    let cleaned = val;
    if (key === 'nombre' || key === 'apellidos') {
      cleaned = cleanNameInput(val);
    } else if (key === 'telefono') {
      cleaned = cleanPhoneInput(val);
    } else if (key === 'ci') {
      cleaned = cleanCIInput(val);
    }
    setForm(prev => ({ ...prev, [key]: cleaned }));
    setErrors(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // ✅ Validación en tiempo real (igual que en registro)
  useEffect(() => {
    const newErrors = {};
    if (form.nombre && (form.nombre.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim()))) {
      newErrors.nombre = 'El nombre debe tener al menos 3 letras y solo puede contener letras.';
    }
    if (form.apellidos && (form.apellidos.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellidos.trim()))) {
      newErrors.apellidos = 'Los apellidos deben tener al menos 3 letras y solo pueden contener letras.';
    }
    if (form.correo && (!EMAIL_REGEX.test(form.correo) || form.correo.length > 70)) {
      newErrors.correo = 'El correo debe ser válido y tener máximo 70 caracteres.';
    }
    if (form.telefono && !/^[67]\d{7}$/.test(form.telefono)) {
      newErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    }
    if (form.ci && !/^\d{6,10}$/.test(form.ci)) {
      newErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, [form]);

  const submit = async () => {
    setSubmitting(true);

    // Validación completa (incluye unicidad)
    const fullErrors = {};
    if (!form.nombre.trim() || form.nombre.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.nombre.trim())) {
      fullErrors.nombre = 'El nombre debe tener al menos 3 letras y solo puede contener letras.';
    }
    if (!form.apellidos.trim() || form.apellidos.trim().length < 3 || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.apellidos.trim())) {
      fullErrors.apellidos = 'Los apellidos deben tener al menos 3 letras y solo pueden contener letras.';
    }
    if (!form.correo.trim()) {
      fullErrors.correo = 'El correo es obligatorio.';
    } else if (form.correo.length > 70) {
      fullErrors.correo = 'El correo no debe exceder los 70 caracteres.';
    } else if (!EMAIL_REGEX.test(form.correo)) {
      fullErrors.correo = 'El correo debe tener un formato válido (ej: nombre@dominio.com).';
    } else {
      const emailExists = await responsablesRepo.isEmailRegistered(form.correo, initial?.id);
      if (emailExists) fullErrors.correo = 'Este correo ya está registrado.';
    }
    if (!form.telefono) {
      fullErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^[67]\d{7}$/.test(form.telefono)) {
      fullErrors.telefono = 'El teléfono debe tener 8 dígitos y comenzar con 6 o 7.';
    } else {
      const phoneExists = await responsablesRepo.isPhoneRegistered(form.telefono, initial?.id);
      if (phoneExists) fullErrors.telefono = 'Este número ya está registrado.';
    }
    if (!form.ci) {
      fullErrors.ci = 'El CI es obligatorio.';
    } else if (!/^\d{6,10}$/.test(form.ci)) {
      fullErrors.ci = 'El CI debe tener entre 6 y 10 dígitos.';
    } else {
      const ciExists = await responsablesRepo.isCIRegistered(form.ci, initial?.id);
      if (ciExists) fullErrors.ci = 'Este CI ya está registrado.';
    }
    if (!form.area) {
      fullErrors.area = 'Selecciona un área.';
    } else {
      const areaList = form.area !== initial?.area ? takenAreas.filter(a => a !== initial?.area) : takenAreas;
      if (areaList.includes(form.area)) {
        fullErrors.area = 'Esta área ya tiene un responsable asignado.';
      }
    }

    if (Object.keys(fullErrors).length > 0) {
      setErrors(fullErrors);
      setSubmitting(false);
      return { ok: false };
    }

    try {
      const payload = { ...form, telefono: form.telefono.replace(/\+591\s?/, "") };
      const updated = await responsablesRepo.update(initial.id, payload);
      setSubmitting(false);
      return { ok: true, data: updated };
    } catch (err) {
      setSubmitting(false);
      return { ok: false, error: err.response?.data?.message || "Error al actualizar" };
    }
  };

  return { form, setField, errors, submitting, submit };
}