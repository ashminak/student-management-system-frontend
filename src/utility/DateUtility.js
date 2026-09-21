const formateDate = (dateString) => {
    if (!dateString) return undefined;

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November",
        "December"
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();


    return `${day} ${month} ${year}`;
};

const formatDateForBackend = (date) => {
    if (!date) return undefined;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};


export { formateDate,formatDateForBackend};