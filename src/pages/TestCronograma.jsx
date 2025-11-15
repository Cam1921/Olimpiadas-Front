// src/pages/TestCronograma.jsx
import CronogramaActividadesPanel from "../components/CronogramaActividadesPanel";

export default function TestCronograma() {
  return (
    <div className="p-6">
      <CronogramaActividadesPanel userRole="admin" />
    </div>
  );
}
