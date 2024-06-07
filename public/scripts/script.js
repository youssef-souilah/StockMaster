

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
            <button onclick="editProduct('${productId}')" x-  data-bs-toggle="modal" data-bs-target="#addProductModal" class="text-blue border-0 bg-transparent" >
                <img src="/icons/pencil.svg" alt="SVG Image" >
            </button>
            <button onclick="deleteProduct('${productId}')" class="text-red border-0 bg-transparent" >
                <img src="/icons/trash.svg" alt="SVG Image">
            </button>
        </td>`;
        tableBody += '</tr>';
    }

    document.getElementById('productTableBody').innerHTML = tableBody;

}

function displayResult(tab) {
    try {
        updateActiveTap(tab);
        var xmlContent = ''; 
        var xsltContent = ''; 
        fetchXMLData('/products.xml', function (content) {
            xmlContent = content;
            fetchXMLData(`/${tab}.xslt`, function (content) {
                xsltContent = content;
                var parser = new DOMParser();
                var xml = parser.parseFromString(xmlContent, 'text/xml');
                var xslt = parser.parseFromString(xsltContent, 'text/xml');
                var xsltProcessor = new XSLTProcessor();
                xsltProcessor.importStylesheet(xslt);
                var resultDocument = xsltProcessor.transformToFragment(xml, document);
                document.getElementById('table').innerHTML="";
                document.getElementById('table').appendChild(resultDocument);
            });
        });
    } catch (error) {
        alert("une erreur occures !")
        console.error('Error:', error);
    }
}

function editProduct(productId) {
    // Fetch product data (this example assumes you have a function or a way to get the product data)
    // Fill the form fields with the product data
    let product={
        id:"f",
        Name:"",
        Price:"",
        Category:"",
        Brand:"",
        Rating_Count:"",
        Inventory_Count:"",
    }
    document.getElementById('ProductModalLabel').textContent="Modifier le produit";
    document.getElementById('ProductModalAction').textContent="Modifier";
    document.getElementById('ProductModalAction').onclick= saveProduct;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.Name;
    document.getElementById('product-price').value = product.Price;
    document.getElementById('product-category').value = product.Category;
    document.getElementById('product-brand').value = product.Brand;
    document.getElementById('product-rating-count').value = product.Rating_Count;
    document.getElementById('product-inventory-count').value = product.Inventory_Count;

    // Show the modal
    var editProductModal = new bootstrap.Modal(document.getElementById('ProductModal'));
    editProductModal.show();
}

function saveProduct() {
    // Get the updated product data from the form
    const updatedProduct = {
        id: document.getElementById('product-id').value,
        Name: document.getElementById('product-name').value,
        Price: document.getElementById('product-price').value,
        Category: document.getElementById('product-category').value,
        Brand: document.getElementById('product-brand').value,
        Rating_Count: document.getElementById('product-rating-count').value,
        Inventory_Count: document.getElementById('product-inventory-count').value,
    };

    // Save the updated product (this example assumes you have a function or a way to save the product data)
    saveProductData(updatedProduct);

    // Hide the modal
    var editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    editProductModal.hide();
}

function updateActiveTap(tap){
    document.querySelectorAll('.nav-link').forEach((item)=>{
        item.classList.remove('active');
    });
    document.getElementById(tap).classList.add('active');
}

function handleTabChange() {
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tab') && (urlParams.get('tab') == 'populaires'||urlParams.get('tab') == 'prixeleve'||urlParams.get('tab') == 'basprix')) {
        displayResult(urlParams.get('tab'));
    }
}
async function deleteProduct(id){
    if (confirm('êtes-vous sûr de vouloir supprimer ce produit !')){
        await fetch(`/products/delete/${id}`,{
            method:"Delete",
        })
        .then((res)=>res.json())
        .then((res)=>{
            alert(res.message);
            window.location.href="/"
        })
        .catch((e)=>{
            alert(e.message);
        })
    }
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
    
    handleTabChange();
});