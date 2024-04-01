import accounting from "accounting";

export class Utils {

    static formatMoney (amount)  {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          maximumFractionDigits: 2,
          currency: 'BRL'
      } ).format(amount);
    }
  
    static unformatMoney (value) {
        return accounting.unformat(value, ',')
    }

    static formatDateFromString(dateString: string): string {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    
  }