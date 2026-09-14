
"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getContact } from "../../../../Services/Contact_Service";

function Page() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch contact messages
  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await getContact();

      if (response.success) {
        setContacts(response.contacts);
      } else {
        toast.error(
          response.message || "Failed to fetch contacts"
        );
      }
    } catch (error) {
      console.error("Get contacts error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Contact Messages
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage messages received from customers.
        </p>
      </div>

      {/* Contact Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading contact messages...
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No contact messages found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Name
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Email
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Subject
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Message
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {contact.name}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {contact.email}
                    </td>

                    {/* Subject */}
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {contact.subject}
                    </td>

                    {/* Message */}
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">
                        {contact.message}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          contact.status === "unread"
                            ? "bg-red-100 text-red-600"
                            : contact.status === "read"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(
                        contact.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;

