//Formatar datas para exibição
export const formatDateRange = (start: Date, end: Date) => {
    const isSameMonth = start.getMonth() === end.getMonth();
    const isSameYear = start.getFullYear() === end.getFullYear();
    
    if (isSameMonth && isSameYear) {
      return `${start.getDate()} - ${end.getDate()} de ${start.toLocaleDateString('pt-BR', { month: 'long' })} ${isSameYear ? '' : start.getFullYear()}`;
    } else if (isSameYear) {
      return `${start.getDate()} de ${start.toLocaleDateString('pt-BR', { month: 'long' })} - ${end.getDate()} de ${end.toLocaleDateString('pt-BR', { month: 'long' })} ${start.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('pt-BR')} - ${end.toLocaleDateString('pt-BR')}`;
    }
  };
 