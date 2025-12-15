import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock Data
const MOCK_ORDERS = [
    {
        id: "ORD-001",
        customer: "Alice Johnson",
        date: "2024-03-20",
        total: 129.99,
        status: "Delivered",
        items: 2,
    },
    {
        id: "ORD-002",
        customer: "Bob Smith",
        date: "2024-03-21",
        total: 59.50,
        status: "Processing",
        items: 1,
    },
    {
        id: "ORD-003",
        customer: "Charlie Brown",
        date: "2024-03-22",
        total: 299.00,
        status: "Shipped",
        items: 3,
    },
    {
        id: "ORD-004",
        customer: "Diana Prince",
        date: "2024-03-23",
        total: 85.00,
        status: "Pending",
        items: 1,
    },
    {
        id: "ORD-005",
        customer: "Ethan Hunt",
        date: "2024-03-24",
        total: 450.25,
        status: "Processing",
        items: 4,
    },
];

export default function SellerOrders() {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered":
                return "default";
            case "Shipped":
                return "secondary";
            case "Processing":
                return "outline";
            case "Pending":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <div className="space-y-6 fade-in">
            <h1 className="text-3xl font-serif font-bold">Orders</h1>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_ORDERS.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>${order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusColor(order.status) as any}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
