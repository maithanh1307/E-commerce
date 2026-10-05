import { useEffect, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import type { Address } from '../../../models/Order';
import { formatAddress, loadAddresses, saveAddresses } from '../../../data/Address';
import { AddressForm, EMPTY, type FormValues } from '../../checkout/components/ShippingStep';


export default function AddressesSection() {
    const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
    const [editing, setEditing] = useState<Address | 'new' | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    useEffect(() => { saveAddresses(addresses); }, [addresses]);

    const save = (values: FormValues, id?: string) => {
        setAddresses((list) =>
            id
                ? list.map((a) => (a.id === id ? { ...values, id } : a))
                : [...list, { ...values, id: `addr-${Date.now()}` }],
        );
        setEditing(null);
    };

    const remove = (id: string) => {
        setAddresses((list) => list.filter((a) => a.id !== id));
        setConfirmId(null);
    };

    const editingAddress = editing && editing !== 'new' ? editing : undefined;

    return (
        <section className="ac-card" aria-labelledby="addr-title">
            <div className="ac-card__head">
                <h1 id="addr-title">My Addresses</h1>
                {editing === null && addresses.length > 0 && (
                    <button type="button" className="ac-edit" onClick={() => setEditing('new')}>
                        <Plus size={16} aria-hidden /> Add address
                    </button>
                )}
            </div>

            {editing !== null ? (
                <AddressForm
                    key={editingAddress?.id ?? 'new'}
                    initial={editingAddress ?? EMPTY}
                    onCancel={() => setEditing(null)}
                    onSubmit={(values) => save(values, editingAddress?.id)}
                />
            ) : addresses.length === 0 ? (
                <div className="ac-empty">
                    <MapPin size={44} strokeWidth={1.3} aria-hidden />
                    <p>You haven’t saved any delivery addresses yet.</p>
                    <button type="button" className="ac-btn" onClick={() => setEditing('new')}>Add an address</button>
                </div>
            ) : (
                <ul className="ac-addresses">
                    {addresses.map((a) => (
                        <li key={a.id} className="ac-addr">
                            <div>
                                <strong>{a.fullName}</strong>
                                <span>{formatAddress(a)}</span>
                                <span>{a.phone}</span>
                            </div>

                            {confirmId === a.id ? (
                                <div className="ac-addr__actions" role="group" aria-label="Confirm delete">
                                    <button type="button" className="ac-link ac-link--danger" onClick={() => remove(a.id)}>Delete</button>
                                    <button type="button" className="ac-link" onClick={() => setConfirmId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="ac-addr__actions">
                                    <button type="button" className="ac-link" onClick={() => setEditing(a)}>Edit</button>
                                    <button type="button" className="ac-link ac-link--danger" onClick={() => setConfirmId(a.id)}>Remove</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}