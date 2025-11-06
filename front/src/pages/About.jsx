import { CardAbout } from "../atoms/CardAbout";
import { LayoutNavFoo } from "../layouts/LayoutNavFoo";
import { FaUser, FaFlag } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

export const About = () => {
  return (
    <LayoutNavFoo>
      <div className="flex flex-col items-center justify-center h-full w-full py-8 px-4">
        <div className="px-4 max-w-[45%] text-center flex flex-col">
          <h1 className="text-3xl font-bold text-center">
            Detalles personales
          </h1>
          <p className="mt-4 text-pink-900 text-base font-bold">
            En Accesorios Majo Tafur, creemos que los accesorios son la clave para expresar tu
            estilo único y realzar tu personalidad.
          </p>
          <p className="mt-4 text-gray-600 text-base">
            Desde nuestra fundación, nos hemos dedicado a ofrecer una cuidadosa
            selección de accesorios de moda de alta calidad que complementan y
            enriquecen cualquier atuendo.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-12 mt-8">
          <CardAbout
            Icon={FaUser}
            title="Perfil"
            description="Como parte del equipo de Accesorios Majo Tafur, Maria combina su amor por la programación con su estilo único para crear experiencias digitales excepcionales."
          />

          <CardAbout
            Icon={FaLocationPin}
            title="Ubicación"
            description="Accesorios Majo Tafur está ubicada en Neiva-Huila, un vibrante centro de moda y cultura."
          />

          <CardAbout
            Icon={FaFlag}
            title="Intereses"
            description="En Accesorios Majo Tafur, estamos apasionados por la moda, la tecnología y la creatividad. Nos encanta descubrir las últimas tendencias en accesorios y compartir nuestro entusiasmo con nuestra comunidad de clientes."
          />
        </div>
      </div>
    </LayoutNavFoo>
  );
};
