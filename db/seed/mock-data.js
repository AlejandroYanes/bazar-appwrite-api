const dataStructure = [
  {
    name: 'Hogar',
    icon: 'HOME',
    sub: [
      { name: 'Decoracion' },
      { name: 'Muebles' },
      { name: 'Cocina' },
      { name: 'Baño' },
    ],
  },
  {
    name: 'Moda',
    icon: 'FASHION',
    sub: [
      { name: 'Ropa de Hombre' },
      { name: 'Ropa de Mujer' },
      { name: 'Zapatos' },
      { name: 'Complementos' },
    ],
  },
  {
    name: 'Tecnologia',
    icon: 'DEVICES',
    sub: [
      { name: 'Telefonos' },
      { name: 'Computadoras' },
      { name: 'Externos' },
    ],
  },
  {
    name: 'Mascotas',
    icon: 'PET',
    sub: [
      { name: 'Comida' },
      { name: 'Medicamentos' },
      { name: 'Juguetes' },
      { name: 'Complementos' },
    ],
  },
];
const imagePacks = [
  ['6230e694833eba9af7fd', '6230e68c8408102676f5', '6230e6863886926773ae', '6230e680d510c4ebdcd3', '6230e679ea1db38c9a89'],
  ['6230e67302462c83920c', '6230e66d9fa17c991995', '6230e6673888c07e0662'],
  ['6230e65aa161f312621f', '6230e653e8dc7794f676', '6230e64635a01953213e'],
];

module.exports = {
  dataStructure,
  imagePacks,
};
