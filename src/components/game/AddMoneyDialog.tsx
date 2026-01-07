import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface AddMoneyDialogProps {
    onAddFunds: (amount: number, accountNumber: string) => Promise<void>;
}

export const AddMoneyDialog = ({ onAddFunds }: AddMoneyDialogProps) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !accountNumber) return;

        const amountNum = parseInt(amount, 10);
        if (isNaN(amountNum) || amountNum <= 0) return;

        if (accountNumber.length !== 12) {
            // Basic frontend check, backend has strict check
            alert("Account number must be 12 digits");
            return;
        }

        setLoading(true);
        await onAddFunds(amountNum, accountNumber);
        setLoading(false);
        setOpen(false);
        setAmount('');
        setAccountNumber('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-primary/50 text-primary hover:bg-primary/10">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Funds</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Funds to Wallet</DialogTitle>
                    <DialogDescription>
                        Enter your account details and the amount you wish to add.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account" className="text-right">
                            Account No.
                        </Label>
                        <Input
                            id="account"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="1234567890"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="5000"
                            className="col-span-3"
                            min="1"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Processing...' : 'Add Funds'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
