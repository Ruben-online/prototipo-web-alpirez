/**
 * Catálogo de tratamientos de Dermo Clini-K.
 *
 * Los tratamientos están organizados en seis categorías.
 * Las fotografías son ilustrativas
 */

import evaluacionFacial from '../assets/treatments/evaluacion-facial.webp'
import mascarillaFacial from '../assets/treatments/aplicacion-mascarilla-facial.webp'
import evaluacionPies from '../assets/treatments/evaluacion-dermatologica-pies.webp'
import procedimientoFacialEquipo from '../assets/treatments/procedimiento-facial-equipo.webp'
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
    id: 'dermatologia',
    number: '03',
    title: 'Dermatología y cuidado de la piel',
    description:
      'Atención dermatológica para el cuidado de la piel y las uñas.',
    image: evaluacionPies,
    imageAlt: 'Evaluación dermatológica de los pies y las uñas',
    imagePosition: 'center 48%',
    treatments: [
      {
        id: 'cuidados-piel',
        name: 'Cuidados básicos de la piel',
      },
      {
        id: 'laser-vitiligo',
        name: 'Láser de vitíligo',
      },
      {
        id: 'tratamiento-onicomicosis',
        name: 'Tratamiento de onicomicosis',
      },
      {
        id: 'laser-onicomicosis',
        name: 'Láser de onicomicosis',
      },
      {
        id: 'microdermoabrasion',
        name: 'Microdermoabrasión',
      },
      {
        id: 'peeling-quimico',
        name: 'Peeling químico',
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
        id: 'eliminacion-tatuajes',
        name: 'Eliminación de tatuajes',
      },
      {
        id: 'laser-co2',
        name: 'Láser CO₂',
      },
      {
        id: 'plasmalaser',
        name: 'Plasmaláser',
      },
    ],
  },
  {
    id: 'estetica-facial',
    number: '05',
    title: 'Estética facial',
    description:
      'Procedimientos enfocados en el cuidado y la armonía facial.',
    image: mascarillaFacial,
    imageAlt: 'Profesional aplicando un tratamiento de cuidado facial',
    imagePosition: 'center 75%',
    treatments: [
      {
        id: 'estetica-nariz',
        name: 'Estética de la nariz',
      },
      {
        id: 'radiofrecuencia',
        name: 'Radiofrecuencia',
      },
    ],
  },
  {
    id: 'estetica-corporal',
    number: '06',
    title: 'Estética corporal',
    description:
      'Opciones de cuidado estético para diferentes zonas del cuerpo.',
    image: procedimientoFacialEquipo,
    imageAlt: 'Equipo especializado utilizado durante un procedimiento estético',
    imagePosition: 'center 30%',
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