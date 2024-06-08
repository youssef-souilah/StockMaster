document.getElementById('ProductModalAction').addEventListener('click',(e)=>{
    e.preventDefault();
    saveProduct()
})

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
    fetch('/products/'+productId)
        .then((res)=>res.json())
        .then((res)=>{
            document.getElementById('ProductModalLabel').textContent="Modifier le produit";
            document.getElementById('ProductModalAction').textContent="Modifier";
            document.getElementById('product-id').value = res.data.$.id;
            document.getElementById('product-name').value = res.data.Name[0];
            document.getElementById('product-price').value = res.data.Price[0];
            document.getElementById('product-category').value = res.data.Category[0];
            document.getElementById('product-brand').value = res.data.Brand[0];
            document.getElementById('product-rating-count').value = res.data.Rating_Count[0];
            document.getElementById('product-inventory-count').value = res.data.Inventory_Count[0];

            // Show the modal
            var editProductModal = new bootstrap.Modal(document.getElementById('ProductModal'));
                editProductModal.show();
        })
        .catch((e)=>{
            alert(e.message)
            console.log(e);
        });
}

function saveProduct() {
    // Get the updated product data from the form
    const product = {
        id: document.getElementById('product-id').value,
        Name: document.getElementById('product-name').value,
        Price: document.getElementById('product-price').value,
        Category: document.getElementById('product-category').value,
        Brand: document.getElementById('product-brand').value,
        Rating_Count: document.getElementById('product-rating-count').value,
        Inventory_Count: document.getElementById('product-inventory-count').value,
    };

    // Save the updated product (this example assumes you have a function or a way to save the product data)
    // saveProductData(updatedProduct);
    console.log(product)

    // Hide the modal
    var editProductModal = bootstrap.Modal.getInstance(document.getElementById('ProductModal'));
    editProductModal.hide();
}

function resetModal(){
    document.getElementById('ProductModalLabel').textContent="Ajouter un Nouveau Produit";
    document.getElementById('ProductModalAction').textContent="Ajouter";
    document.getElementById('ProductModalAction').onclick= saveProduct;
    document.getElementById('ProductForm').reset();
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
document.getElementById('ProductModal').addEventListener('hide.bs.modal', function () {
    resetModal()
});
async function getCategories(){
    let data=[];
    await fetch('/categories')
        .then((res)=>res.json())
        .then((res)=>{
            data= res.data;
        })
        .catch((e)=>{
            alert(e.message);
        })
        
    return data;    
}
async function listCategories(data){
    if(data.length>0){
        document.getElementById('Categories').innerHTML="";
        data.map((item)=>{
            document.getElementById('Categories').innerHTML+=`
                <div class="card" style="width: 18rem;">
                    <div class="card-header"></div>
                    <div class="card-body">
                        <h5 class="card-title my-5 text-center">${item.Name[0]}</h5>
                        <div style="display: flex;align-items: center;justify-content: space-between;">
                            <a href="/products/category/${item.Name[0]}" class="btn btn-primary">voir Produits</a>
                            <button onclick="deleteCategory('${item.Name[0]}')" class="text-red border-0 bg-transparent" >
                                <img src="/icons/trash.svg" alt="SVG Image">
                            </button>
                        </div>
                    </div>
                </div>
            `;
        })
    }
    else{
        document.getElementById('Categories').innerHTML="";
        document.getElementById('Categories').innerHTML=`
            <div>Pas de Categories</div> 
        `;
    }
}
function populateSelectCategory(data){
    if(data.length>0){
        document.getElementById('product-category').innerHTML="";
        document.getElementById('product-category').innerHTML=`
            <option value="">---Selectionner---</option>
        `;
        data.map((item)=>{
            document.getElementById('product-category').innerHTML+=`
                <option value="${item.Name[0]}">${item.Name[0]}</option>
            `;
        });
    }
}
document.addEventListener("DOMContentLoaded", async function() {
    let categories=await getCategories();
    populateSelectCategory(categories)
    fetchXMLData('/products.xml', function(xmlData) {
        drowTable(xmlData)
    });
    listCategories(categories);
    handleTabChange();
});