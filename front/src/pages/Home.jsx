import { EnvioGratis } from "../atoms/EnvioGratis";
import { Accesorios } from "../components/Accesorios";
import { Favoritos } from "../components/Favoritos";
import { Hero } from "../components/Hero";
import { Presentacion } from "../components/Presentacion";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";

export const Home = () => {
  const images = [
    "/img/carrusel3.webp",
    "/img/carrusel1.webp",
    "/img/carrusel2.webp",
  ];
  return (
    <LayoutNavFoo>
      <Hero images={images} />
      <Accesorios />
      <Presentacion />
      <EnvioGratis />
      <Favoritos />
      <div className="relative w-full">
        <img
          src="/img/banner.png"
          alt="Banner"
          className="w-full h-auto object-cover"
        />
      </div>
    </LayoutNavFoo>
  );
};
