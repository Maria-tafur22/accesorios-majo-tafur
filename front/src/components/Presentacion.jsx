import { useNavigate } from "react-router-dom";

export const Presentacion = () => {
  const navigate = useNavigate();

  const navigateToAbout = () => {
    navigate("/about");
  };

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/aretes.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-transparent to-black/80 text-center px-6 md:px-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
          Accesorios y Regalos Para Mujer Con Significado
        </h1>
        <p className="text-lg md:text-2xl text-white mb-6 drop-shadow-md">
          Bienvenid@ a Accesoiors Majo Tafur 
        </p>
        <p className="text-md md:text-lg text-white mb-8 drop-shadow-md max-w-2xl">
          Tu tienda online de accesorios de moda y regalos con intenciones para
          mujer. Tenemos para ti la mejor bisutería y accesorios llenos de
          mensajes positivos con un toque muy femenino. Compra Aretes, Collares,
          Pulseras, Tobilleras, Sets y Regalos para Mujer. Compra desde la
          comodidad de tu casa u oficina a un sólo clic las 24 horas del día los
          7 días de la semana. Enviamos a todas las ciudades de Colombia;
          Medellín, Bogotá, Cali, Cartagena, Barranquilla, Santa Marta.
        </p>
        <button
          onClick={navigateToAbout}
          className="px-6 py-3 bg-pink-600 text-white text-lg font-semibold rounded-full hover:bg-pink-700 transition-transform transform hover:scale-105"
        >
          Más Información
        </button>
      </div>
    </div>
  );
};
