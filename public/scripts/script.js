let selectedUpdatedProduct;
document.addEventListener("DOMContentLoaded", async function() {
    const parser = new DOMParser();
    let productsXML;
    
    let categories=await getCategories();
    populateSelectCategory(categories)
    fetchXMLData('/products.xml', function(xmlData) {
        drowTable(xmlData);
        productsXML=xmlData;
    });
    listCategories(categories);
    handleTabChange();
    
    document.getElementById('search-id').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-name').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-price').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-category').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-brand').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-rating-count').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    document.getElementById('search-inventory-count').addEventListener('input', (e)=>{
        filterTable(productsXML,parser);
    });
    
    
});

function drowTable(xmlData){
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
    const products = xmlDoc.getElementsByTagName('Product');

    let tableBody = '';
    if(products.length>0){
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
            tableBody += `<td class="w-4">
                <button onclick="editProduct('${productId}')" x-  data-bs-toggle="modal" data-bs-target="#addProductModal" class="text-blue border-0 bg-transparent" >
                    <img src="/icons/pencil.svg" alt="SVG Image" >
                </button>
                <button onclick="deleteProduct('${productId}')" class="text-red border-0 bg-transparent" >
                    <img src="/icons/trash.svg" alt="SVG Image">
                </button>
            </td>`;
            tableBody += '</tr>';
        }
    }
    else{
        tableBody += '<tr>';
        tableBody += `<td colspan="8" class="text-center">Vide</td>`;
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
    selectedUpdatedProduct=productId;
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

            var editProductModal = new bootstrap.Modal(document.getElementById('ProductModal'));
                editProductModal.show();
        })
        .catch((e)=>{
            alert(e.message)
            console.log(e);
        });
}

function saveProduct() {
    const product = {
        id: document.getElementById('product-id').value,
        Name: document.getElementById('product-name').value,
        Price: document.getElementById('product-price').value,
        Category: document.getElementById('product-category').value,
        Brand: document.getElementById('product-brand').value,
        Rating_Count: document.getElementById('product-rating-count').value,
        Inventory_Count: document.getElementById('product-inventory-count').value,
    };
    if(validateProductForm(product)){
        if(document.getElementById('ProductModalAction').innerText=="Ajouter"){
            addProduct(product);
        }
        else{
            updateProduct(product)
        }
        var editProductModal = bootstrap.Modal.getInstance(document.getElementById('ProductModal'));
        editProductModal.hide();
    }
}

function validateProductForm({id,Name,Price,Category,Brand,Rating_Count,Inventory_Count}) {

    if (id=="" || Name=="" || Price=="" || Category=="" || Brand=="" || Rating_Count=="" || Inventory_Count=="") {
        alert('Tous les champs doivent être remplis.');
        return false;
    }

    else if (isNaN(Price) || Price <= 0) {
        alert('Le prix doit être un nombre positif.');
        return false;
    }

    else if (isNaN(Rating_Count) || Rating_Count < 0 || Rating_Count > 10) {
        alert('Le nombre de notes doit être entre 0 et 10');
        return false;
    }

    else if (isNaN(Inventory_Count) || Inventory_Count < 0) {
        alert('La quantité en stock doit être un nombre non négatif.');
        return false;
    }

    else{
        return true;
    }
    
}
async function addProduct(product){
    const newProduct= {
        $: { id:"produit"+product.id },
        Name: [product.Name],
        Price: [product.Price],
        Category: [product.Category],
        Brand: [product.Brand],
        Rating_Count: [product.Rating_Count],
        Inventory_Count: [product.Inventory_Count]
    };
    await fetch("/products",{
        method:"Post",
        body:JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json"
        },  
    })
    .then((res)=>res.json())
    .then((res)=>{
        alert(res.message)
        window.location.href="/"
    })
    .catch((e)=>{
        alert(e.message)
        window.location.href="/"
    })
}
async function updateProduct(product){
    const newProduct= {
        $: { id:product.id },
        Name: [product.Name],
        Price: [product.Price],
        Category: [product.Category],
        Brand: [product.Brand],
        Rating_Count: [product.Rating_Count],
        Inventory_Count: [product.Inventory_Count]
    };
    await fetch("/products/"+selectedUpdatedProduct,{
        method:"Put",
        body:JSON.stringify(newProduct),
        headers: {
            "Content-Type": "application/json"
        },  
    })
    .then((res)=>res.json())
    .then((res)=>{
        alert(res.message)
        window.location.href="/"
    })
    .catch((e)=>{
        alert(e.message)
        window.location.href="/"
    })
}
async function saveCategory(){
    const category = {
        Name: [document.getElementById('category-name').value],
    };
    if(category.Name!=""){
        await fetch("/categories",{
            method:"Post",
            body:JSON.stringify(category),
            headers: {
                "Content-Type": "application/json"
            },  
        })
        .then((res)=>res.json())
        .then((res)=>{
            alert(res.message)
            window.location.href="/"
        })
        .catch((e)=>{
            alert(e.message)
            window.location.href="/"
        })
    }
    else{
        alert("Il faut remplire le champ de nom !")
    }
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
                <div class="card" style="min-width: 200px;">
                    <div class="card-header"></div>
                    <div class="card-body">
                        <h5 class="card-title my-5 text-center">${item.Name[0]}</h5>
                        <div style="display: flex;align-items: center;justify-content: space-between;">
                            <div></div>
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



function filterTable(xml,parser) {
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const idFilter = document.getElementById('search-id').value;
    const nameFilter = document.getElementById('search-name').value;
    const priceFilter = document.getElementById('search-price').value;
    const categoryFilter = document.getElementById('search-category').value;
    const brandFilter = document.getElementById('search-brand').value;
    const ratingCountFilter = document.getElementById('search-rating-count').value;
    const inventoryCountFilter = document.getElementById('search-inventory-count').value;

    let xpath = "/Products/Product";
    let conditions = [];

    if (idFilter) conditions.push(`@id[contains(., '${idFilter}')]`);
    if (nameFilter) conditions.push(`Name[contains(., '${nameFilter}')]`);
    if (priceFilter) conditions.push(`Price[contains(., '${priceFilter}')]`);
    if (categoryFilter) conditions.push(`Category[contains(., '${categoryFilter}')]`);
    if (brandFilter) conditions.push(`Brand[contains(., '${brandFilter}')]`);
    if (ratingCountFilter) conditions.push(`Rating_Count[contains(., '${ratingCountFilter}')]`);
    if (inventoryCountFilter) conditions.push(`Inventory_Count[contains(., '${inventoryCountFilter}')]`);

    if (conditions.length > 0) {
        xpath += `[${conditions.join(' and ')}]`;
    }

    const result = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    // console.log(result);
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '';

    let node = result.iterateNext();
    while (node) {
        const id = node.getAttribute('id');
        const name = node.getElementsByTagName('Name')[0].textContent;
        const price = node.getElementsByTagName('Price')[0].textContent;
        const category = node.getElementsByTagName('Category')[0].textContent;
        const brand = node.getElementsByTagName('Brand')[0].textContent;
        const ratingCount = node.getElementsByTagName('Rating_Count')[0].textContent;
        const inventoryCount = node.getElementsByTagName('Inventory_Count')[0].textContent;

        const row = `<tr>
                        <td>${id}</td>
                        <td>${name}</td>
                        <td>${price}</td>
                        <td>${category}</td>
                        <td>${brand}</td>
                        <td>${ratingCount}</td>
                        <td>${inventoryCount}</td>
                        <td>
                            <button onclick="editProduct(${id})" class="text-blue border-0 bg-transparent" >
                                <img src="/icons/pencil.svg" alt="SVG Image" />
                            </button>
                            <button onclick="deleteProduct(${id})" class="text-red border-0 bg-transparent" >
                                <img src="/icons/trash.svg" alt="SVG Image" />
                            </button>
                        </td>
                    </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);

        node = result.iterateNext();
    }
}
