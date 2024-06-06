<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <table class="table" >
            <thead>
                <tr>
                    <th scope="col">Product ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Category</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Rating Count</th>
                    <th scope="col">Inventory Count</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody id="productTableBody">
                <xsl:apply-templates select="//Product[Price &lt; 99]"/>
            </tbody>
        </table>
    </xsl:template>
    <xsl:template match="Product">
        <xsl:variable name="productId" select="@id"/>
        <tr>
            <td><xsl:value-of select="@id"/></td>
            <td><xsl:value-of select="Name"/></td>
            <td><xsl:value-of select="Price"/></td>
            <td><xsl:value-of select="Category"/></td>
            <td><xsl:value-of select="Brand"/></td>
            <td><xsl:value-of select="Rating_Count"/></td>
            <td><xsl:value-of select="Inventory_Count"/></td>
            <td>
                <button onclick="editProduct({$productId})" class="text-blue border-0 bg-transparent" >
                    <img src="/icons/pencil.svg" alt="Edit" />
                </button>
                <button onclick="deleteProduct({$productId})" class="text-red border-0 bg-transparent" >
                    <img src="/icons/trash.svg" alt="Delete" />
                </button>
            </td>
        </tr>
    </xsl:template>
</xsl:stylesheet>
