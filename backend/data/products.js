const products = [
  {
    variantId: '',
    rating: 1,
    numReviews: 1,
    price: 3.25,
    countInStock: 5,
    name: 'Giraffe Birthday Card',
    image: '/uploads/image-1627066972096.jpg',
    images: [
      '/uploads/image-1627066972096.jpg',
      'uploads/image-1627214953669.jpg',
      'uploads/image-1627214989064.jpg.jpg',
    ],
    brand: 'sample brand',
    category: 'Cards',
    description:
      'Giraffe Birthday card, avaliable in two sizes, A6 or square 15cmx15cm\nFrom one of my original watercolour paintings and printed on to 300gsm FSC certified card, with white envelope and biodegradable sleeve.',
    reviews: [],
    variations: [
      {
        name: 'Size',
        isOptional: false,
        isSelected: false,
        selectedOption: 0,
        options: [
          {
            additionalPrice: 0,
            name: 'A6',
            linkedImage: 0,
          },
          {
            additionalPrice: 0.25,
            name: 'Square',
            linkedImage: 1,
          },
        ],
      },
      {
        name: 'Text',
        isOptional: false,
        isSelected: false,
        selectedOption: 0,
        options: [
          {
            additionalPrice: 0,
            name: 'Have a Wild Birthday',
          },
          {
            additionalPrice: 0,
            name: 'No Text',
          },
          {
            additionalPrice: 0,
            name: 'Happy Birthday',
          },
        ],
      },
    ],
    personalizations: [
      {
        name: 'Add a name to the front of the card?',
        isOptional: true,
        isSelected: false,
        value:
          'For example "Happy Birthday Emma" or " Have a wild birthday Emma" ',
        additionalPrice: 0,
      },
    ],
    __v: 2,
  },
  {
    variantId: '',
    rating: 3,
    numReviews: 2,
    price: 599.99,
    countInStock: 7,
    name: 'iPhone 11 Pro 256GB Memory',
    image: '/images/phone.jpg',
    images: ['/images/phone.jpg', 'uploads/image-1627215109963.jpg'],
    description:
      'Introducing the iPhone 11 Pro. A transformative triple-camera system that adds tons of capability without complexity. An unprecedented leap in battery life',
    brand: 'Apple',
    category: 'Electronics',
    reviews: [],
    variations: [
      {
        name: 'Additional Memory',
        isOptional: true,
        isSelected: false,
        selectedOption: 0,
        options: [
          {
            additionalPrice: 90,
            name: '512GB',
          },
          {
            additionalPrice: 200,
            name: '1024GB',
          },
        ],
      },
      {
        name: 'Ram Size',
        isOptional: false,
        isSelected: false,
        selectedOption: 0,
        options: [
          {
            additionalPrice: 0,
            name: '3GB',
          },
          {
            additionalPrice: 50,
            name: '4GB',
          },
        ],
      },
    ],
    personalizations: [
      {
        name: 'Engraving',
        isOptional: true,
        isSelected: false,
        value: '<your engraving text>',
        additionalPrice: 65,
      },
      {
        name: 'Greeting Message',
        isOptional: false,
        isSelected: false,
        value: 'Welcome to your phone',
        additionalPrice: 0,
      },
    ],
    __v: 4,
  },
];

export default products;
