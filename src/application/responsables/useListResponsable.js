// src/hooks/useListResponsables.js
import { useEffect, useState } from "react";
import { responsablesRepo } from "../../infrastructure/http/responsables/repository";

export function useListResponsables() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    responsablesRepo.list().then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);
  return { rows, setRows, loading };
}