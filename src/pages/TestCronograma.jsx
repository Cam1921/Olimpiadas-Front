// src/pages/TestCronograma.jsx
import CronogramaActividadesPanel from "../components/cronograma/CronogramaActividadesPanel";

export default function TestCronograma() {
  return (
    <div className="p-6">
      <CronogramaActividadesPanel userRole="admin" />
    </div>
  );
}
