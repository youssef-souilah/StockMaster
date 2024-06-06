

function drowTable(xmlData){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    const products = xmlDoc.getElementsByTagName('Product');

    let tableBody = '';
    for (let i = 0; i < products.length; i++) {
        const productId = products[i].getAttribute('id');
        const name = products[i].getElementsByTagName('Name')[0].textContent;
        const category = products[i].getElementsByTagName('Category')[0].textContent;
        const brand = products[i].getElementsByTagName('Brand')[0].textContent;
        const price = products[i].getElementsByTagName('Price')[0].textContent;
        const ratingCount = products[i].getElementsByTagName('Rating_Count')[0].textContent;
        const InventoryCount = products[i].getElementsByTagName('Inventory_Count')[0].textContent;
        tableBody += '<tr>';
        tableBody += `<td>${productId}</td>`;
        tableBody += `<td>${name}</td>`;
        tableBody += `<td>${price}</td>`;
        tableBody += `<td>${category}</td>`;
        tableBody += `<td>${brand}</td>`;
        tableBody += `<td>${ratingCount}</td>`;
        tableBody += `<td>${InventoryCount}</td>`;
        tableBody += `<td>
            <button onclick="editProduct(${productId})" class="text-blue border-0 bg-transparent" >
                <img src="/icons/pencil.svg" alt="SVG Image" >
            </button>
            <button onclick="deleteProduct(${productId})" class="text-red border-0 bg-transparent" >
                <img src="/icons/trash.svg" alt="SVG Image">
            </button>
        </td>`;
        tableBody += '</tr>';
    }

    document.getElementById('productTableBody').innerHTML = tableBody;

}

function fetchXMLData(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(xmlData => callback(xmlData))
        .catch(error => console.error('Error fetching XML:', error));
}
document.addEventListener("DOMContentLoaded", function() {
    fetchXMLData('/products.xml', function(xmlData) {
        drowTable(xmlData)
    });
});