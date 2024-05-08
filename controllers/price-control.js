export default function priceEvaluation(opcion) {
    const opcionNormalizada = opcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    switch(opcionNormalizada) {
      case 'profesional':
        return 250000;
      case 'tecnologo':
        return 200000;
      case 'tecnico':
        return 150000;
      case 'otros':
        return 100000;
      default:
        return 0;
    }
  }
  
