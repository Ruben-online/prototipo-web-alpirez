/**
 * Catálogo de tratamientos de Dermo Clini-K.
 *
 * Los tratamientos están organizados en seis categorías.
 * Las fotografías son ilustrativas.
 */

import evaluacionFacial from '../assets/treatments/evaluacion-facial.webp'
import mascarillaFacial from '../assets/treatments/aplicacion-mascarilla-facial.webp'
import evaluacionPies from '../assets/treatments/evaluacion-dermatologica-pies.webp'
import procedimientoEsteticaCorporal from '../assets/treatments/procedimiento-estetica-corporal.webp'
import procedimientoFacialTecnologia from '../assets/treatments/procedimiento-facial-tecnologia.webp'
import procedimientoTatuajeLaser from '../assets/treatments/procedimiento-tatuaje-laser.webp'

export const treatmentCategories = [
  {
    id: 'acne-manchas',
    number: '01',
    title: 'Acné y manchas',
    description:
      'Cuidado especializado para las necesidades de la piel con acné y manchas.',
    image: evaluacionFacial,
    imageAlt: 'Profesional realizando una evaluación de la piel del rostro',
    imagePosition: 'center 10%',
    treatments: [
      {
        id: 'tratamiento-manchas',
        name: 'Tratamiento de manchas',
      },
      {
        id: 'laser-manchas',
        name: 'Láser de manchas',
      },
      {
        id: 'tratamiento-acne',
        name: 'Tratamiento de acné',
      },
      {
        id: 'laser-acne',
        name: 'Láser de acné',
      },
      {
        id: 'laser-pecas',
        name: 'Láser para eliminar pecas',
      },
    ],
  },
  {
    id: 'rejuvenecimiento',
    number: '02',
    title: 'Rejuvenecimiento facial y corporal',
    description:
      'Opciones para mejorar la apariencia, textura y firmeza de la piel.',
    image: procedimientoFacialTecnologia,
    imageAlt: 'Procedimiento facial realizado con un equipo especializado',
    imagePosition: 'center 15%',
    treatments: [
      {
        id: 'rejuvenecimiento-facial',
        name: 'Rejuvenecimiento facial',
      },
      {
        id: 'eliminacion-arrugas',
        name: 'Eliminación de arrugas',
      },
      {
        id: 'rejuvenecimiento-manos',
        name: 'Rejuvenecimiento de manos',
      },
      {
        id: 'rejuvenecimiento-escote',
        name: 'Rejuvenecimiento de escote',
      },
      {
        id: 'volumen-facial',
        name: 'Volumen facial',
      },
      {
        id: 'bioestimuladores',
        name: 'Bioestimuladores',
      },
    ],
  },
  {
    id: 'podologia',
    number: '03',
    title: 'Servicio podológico general',
    description:
      'Evaluación y cuidado profesional de los pies y las uñas, con tratamientos especializados para distintas necesidades podológicas.',
    image: evaluacionPies,
    imageAlt: 'Evaluación profesional de los pies y las uñas',
    imagePosition: 'center 48%',
    treatments: [
      {
        id: 'evaluacion-podologica',
        name: 'Evaluación podológica y valoración del estado de tus pies',
      },
      {
        id: 'corte-limpieza-unas',
        name: 'Tratamiento de corte y limpieza profesional de las uñas',
      },
      {
        id: 'unas-encarnadas',
        name: 'Tratamiento de uñas encarnadas',
      },
      {
        id: 'unas-engrosadas',
        name: 'Tratamiento de uñas engrosadas',
      },
      {
        id: 'callos-durezas',
        name: 'Eliminación de callos y durezas',
      },
      {
        id: 'helomas',
        name: 'Tratamiento de helomas (ojos de pescado)',
      },
      {
        id: 'tratamiento-onicomicosis',
        name: 'Tratamiento de onicomicosis (hongos en las uñas)',
      },
      {
        id: 'verrugas-plantares',
        name: 'Tratamiento de verrugas plantares',
      },
    ],
  },
  {
    id: 'tecnologia-laser',
    number: '04',
    title: 'Tecnología láser',
    description:
      'Tecnología especializada aplicada a procedimientos dermatológicos y estéticos.',
    image: procedimientoTatuajeLaser,
    imageAlt: 'Procedimiento con equipo especializado sobre un tatuaje',
    imagePosition: 'center 52%',
    treatments: [
      {
        id: 'laser-acne',
        name: 'Láser de acné',
      },
      {
        id: 'laser-manchas',
        name: 'Láser de manchas',
      },
      {
        id: 'laser-rejuvenecimiento',
        name: 'Láser de rejuvenecimiento',
      },
      {
        id: 'laser-co2-cicatrices',
        name: 'Láser CO₂ para cicatrices',
      },
      {
        id: 'plasma-laser',
        name: 'Plasma láser',
      },
      {
        id: 'laser-vitiligo',
        name: 'Láser para vitíligo',
      },
      {
        id: 'laser-rosacea',
        name: 'Láser para rosácea',
      },
      {
        id: 'laser-picosegundos-tatuajes',
        name: 'Láser de picosegundos para tatuajes',
      },
      {
        id: 'laser-hongos-unas',
        name: 'Láser para uñas con hongos',
      },
    ],
  },
  {
    id: 'estetica-facial',
    number: '05',
    title: 'Estética facial',
    description:
      'Procedimientos enfocados en el cuidado, la firmeza y la armonía facial.',
    image: mascarillaFacial,
    imageAlt: 'Profesional aplicando un tratamiento de cuidado facial',
    imagePosition: 'center 75%',
    treatments: [
      {
        id: 'estetica-nariz',
        name: 'Estética de nariz',
      },
      {
        id: 'hifu-flacidez',
        name: 'Ultrasonido focalizado HIFU para flacidez',
      },
      {
        id: 'radiofrecuencia-facial',
        name: 'Radiofrecuencia facial',
      },
      {
        id: 'radiofrecuencia-fraccionada',
        name: 'Radiofrecuencia fraccionada',
      },
      {
        id: 'volumen-facial',
        name: 'Volumen facial',
      },
    ],
  },
  {
    id: 'estetica-corporal',
    number: '06',
    title: 'Estética corporal',
    description:
      'Opciones de cuidado estético para diferentes zonas del cuerpo.',
    image: procedimientoEsteticaCorporal,
    imageAlt:
      'Imagen ilustrativa de un procedimiento estético corporal en la zona abdominal',
    imagePosition: 'center 50%',
    treatments: [
      {
        id: 'tratamiento-celulitis',
        name: 'Tratamiento de celulitis',
      },
      {
        id: 'onda-choque',
        name: 'Onda de choque',
      },
      {
        id: 'criolipolisis',
        name: 'Criolipólisis',
      },
      {
        id: 'moldeo-enzimas',
        name: 'Moldeo corporal con enzimas',
      },
    ],
  },
]