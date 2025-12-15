import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["Shirts", "Dresses", "Shoes", "Accessories"];

export default function SellerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    // Mock stock state since it's not in DB yet
    const [stock, setStock] = useState("10");

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    const fetchProducts = async () => {
        const { data } = await supabase
            .from("products")
            .select("*")
            .eq("seller_id", user?.id)
            .order("created_at", { ascending: false });

        if (data) {
            // Add mock stock data
            const productsWithStock = data.map(p => ({
                ...p,
                stock: Math.floor(Math.random() * 50) + 1, // Mock stock
                status: Math.random() > 0.2 ? 'Active' : 'Draft' // Mock status
            }));
            setProducts(productsWithStock);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            title,
            description,
            price: parseFloat(price),
            category,
            brand: brand || null,
            image_url: imageUrl,
            seller_id: user?.id,
        };

        if (editingProduct) {
            const { error } = await supabase
                .from("products")
                .update(productData)
                .eq("id", editingProduct.id);

            if (!error) {
                toast.success("Product updated!");
                resetForm();
                fetchProducts();
            }
        } else {
            const { error } = await supabase
                .from("products")
                .insert(productData);

            if (!error) {
                toast.success("Product added!");
                resetForm();
                fetchProducts();
            }
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setTitle(product.title);
        setDescription(product.description || "");
        setPrice(product.price.toString());
        setCategory(product.category);
        setBrand(product.brand || "");
        setImageUrl(product.image_url);
        setStock(product.stock?.toString() || "10");
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id);

            if (!error) {
                toast.success("Product deleted");
                fetchProducts();
            }
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");
        setBrand("");
        setImageUrl("");
        setStock("10");
        setEditingProduct(null);
        setDialogOpen(false);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold">Products</h1>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="font-serif">
                                {editingProduct ? "Edit Product" : "Add New Product"}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the details for your product
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    maxLength={200}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    maxLength={1000}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock (Mock) *</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={category} onValueChange={setCategory} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat} value={cat.toLowerCase()}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        maxLength={100}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">Image URL *</Label>
                                <Input
                                    id="imageUrl"
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    required
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="flex-1">
                                    {editingProduct ? "Update Product" : "Add Product"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No products found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-10 h-10 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell className="capitalize">{product.category}</TableCell>
                                    <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
