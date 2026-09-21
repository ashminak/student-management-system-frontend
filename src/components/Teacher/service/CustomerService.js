const countries = [
    { name: 'Australia', code: 'au' },
    { name: 'Brazil', code: 'br' },
    { name: 'China', code: 'cn' },
    { name: 'Egypt', code: 'eg' },
    { name: 'France', code: 'fr' },
    { name: 'Germany', code: 'de' },
    { name: 'India', code: 'in' },
    { name: 'Japan', code: 'jp' },
    { name: 'Spain', code: 'es' },
    { name: 'United States', code: 'us' }
];

const representatives = [
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
];

const statuses = ['unqualified', 'qualified', 'new', 'negotiation', 'renewal'];
const firstNames = ['James', 'Maria', 'Wei', 'Fatima', 'Liam', 'Sofia', 'Kenji', 'Aisha', 'Carlos', 'Priya'];
const lastNames = ['Butt', 'Silva', 'Zhang', 'Hassan', 'Murphy', 'Rossi', 'Tanaka', 'Khan', 'Garcia', 'Sharma'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateCustomer = (id) => {
    const randomDate = new Date(2018, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    return {
        id,
        name: `${randomFrom(firstNames)} ${randomFrom(lastNames)}`,
        country: randomFrom(countries),
        company: `${randomFrom(lastNames)} & Co`,
        date: randomDate.toISOString().split('T')[0],
        status: randomFrom(statuses),
        activity: Math.floor(Math.random() * 100),
        representative: randomFrom(representatives),
        balance: Math.floor(Math.random() * 100000)
    };
};

const generateData = (count) => {
    return Array.from({ length: count }, (_, i) => generateCustomer(1000 + i));
};

export const CustomerService = {
    getCustomersSmall() {
        return Promise.resolve(generateData(10));
    },
    getCustomersMedium() {
        return Promise.resolve(generateData(50));
    },
    getCustomersLarge() {
        return Promise.resolve(generateData(500));
    },
    getCustomersXLarge() {
        return Promise.resolve(generateData(1000));
    }
};