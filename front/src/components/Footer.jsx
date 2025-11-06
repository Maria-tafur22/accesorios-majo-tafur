import { FaFacebook, FaInstagram, } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-pink-50 text-center py-8">
      <div className="flex md:flex-row flex-col items-center justify-around gap-8 text-gray-800 px-6 w-2/3 m-auto">
        <div>
          <h2 className="font-bold text-lg mb-4">Contactanos:</h2>
          <p>Accesorios Majo Tafur</p>
          <p>🛒 Tienda Online - Neiva, Colombia</p>
          <p>✉️ mtafurguevara@gmail.com</p>
          <p>
            📱 Teléfono & WhatsApp:{" "}
            <a href="https://wa.me/573115001813">
              +57 3115001813
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4">Información:</h2>
          <ul>
            <li>
              <a href="/" className="hover:underline">
                Inicio
              </a>
            </li>
            <li>
              <a href="/Productos" className="hover:underline">
                Productos
              </a>
            </li>
            <li>
              <a href="/About" className="hover:underline">
                Sobre nosotros
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4">Categorías:</h2>
          <ul>
            <li>
              <a href="/productos/Aretes" className="hover:underline">
                Aretes
              </a>
            </li>
            <li>
              <a href="/productos/Collares" className="hover:underline">
                Collares
              </a>
            </li>
            <li>
              <a href="/productos/Manillas" className="hover:underline">
                Manillas
              </a>
            </li>
            <li>
              <a href="/productos/Earcuffs" className="hover:underline">
                Earcuff
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col items-center">
          <div className="flex justify-center gap-4 mt-4">
            <FaFacebook
              className="text-2xl hover:text-gray-600 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/valu.accesorios14?mibextid=ZbWKwL",
                  "_blank"
                )
              }
            />
            <FaInstagram
              className="text-2xl hover:text-gray-600 cursor-pointer"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/accesorios_valu1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
                  "_blank"
                )
              }
            />
            
          </div>
          <p className="mt-4 text-sm text-gray-600">
            ©2024 Accesorios Majo Tafur | Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
