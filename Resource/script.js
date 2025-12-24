var contacts = [
    { id: 1, name: "Mona Abdo", phone: "(202) 555-0001", email: "mona@email.com", gender: "female" },
    { id: 2, name: "Karim Ali", phone: "(202) 555-0002", email: "karim@email.com", gender: "male" },
    { id: 3, name: "Mohamed Ali", phone: "(202) 555-0003", email: "mohamed@email.com", gender: "male" },
    { id: 4, name: "Eman Ali", phone: "(202) 555-0004", email: "eman@email.com", gender: "female" }
];

var currentContactId = null;
var nextId = 5;

function getAvatarImage(gender) {
    return gender === "female" ? "./Images/woman.png" : "./Images/man.png";
}

function renderContactList() {
    var list = $('#contactList');
    list.empty();

    contacts.forEach(function (contact) {
        var avatar = getAvatarImage(contact.gender);
        var item = '<li><a href="#detailPage" data-id="' + contact.id + '">' +
            '<img src="' + avatar + '" class="contact-avatar-small">' +
            '<h2>' + contact.name + '</h2>' +
            '</a></li>';
        list.append(item);
    });

    list.listview('refresh');
}

function validateForm(name, phone, email) {
    if (!name || name.trim() === '') {
        alert('Please enter a name');
        return false;
    }

    if (!phone || phone.trim() === '') {
        alert('Please enter a phone number');
        return false;
    }

    var phonePattern = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    if (!phonePattern.test(phone)) {
        alert('Phone format should be (XXX) XXX-XXXX');
        return false;
    }

    if (!email || email.trim() === '') {
        alert('Please enter an email');
        return false;
    }

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

function findContact(id) {
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].id == id) {
            return contacts[i];
        }
    }
    return null;
}

$(document).ready(function () {
    renderContactList();

    $(document).on('click', '#contactList a', function (e) {
        e.preventDefault();
        currentContactId = $(this).data('id');
        var contact = findContact(currentContactId);

        if (contact) {
            $('#detailName').text(contact.name);
            $('#detailAvatar').attr('src', getAvatarImage(contact.gender));
            $.mobile.changePage('#detailPage');
        }
    });

    $('#saveBtn').click(function (e) {
        e.preventDefault();

        var name = $('#addName').val();
        var phone = $('#addPhone').val();
        var email = $('#addEmail').val();
        var gender = $('input[name="gender"]:checked').val();

        if (validateForm(name, phone, email)) {
            contacts.push({
                id: nextId++,
                name: name,
                phone: phone,
                email: email,
                gender: gender
            });

            $('#addForm')[0].reset();
            renderContactList();
            $.mobile.changePage('#listPage');
        }
    });

    $('#editBtn').click(function (e) {
        e.preventDefault();
        var contact = findContact(currentContactId);

        if (contact) {
            $('#editId').val(contact.id);
            $('#editName').val(contact.name);
            $('#editPhone').val(contact.phone);
            $('#editEmail').val(contact.email);

            if (contact.gender === 'female') {
                $('#editFemale').prop('checked', true).checkboxradio('refresh');
            } else {
                $('#editMale').prop('checked', true).checkboxradio('refresh');
            }

            $.mobile.changePage('#editPage');
        }
    });

    $('#updateBtn').click(function (e) {
        e.preventDefault();

        var id = $('#editId').val();
        var name = $('#editName').val();
        var phone = $('#editPhone').val();
        var email = $('#editEmail').val();
        var gender = $('input[name="editGender"]:checked').val();

        if (validateForm(name, phone, email)) {
            var contact = findContact(id);

            if (contact) {
                contact.name = name;
                contact.phone = phone;
                contact.email = email;
                contact.gender = gender;

                renderContactList();
                $.mobile.changePage('#detailPage');
            }
        }
    });

    $('#deleteBtn').click(function (e) {
        e.preventDefault();
        $.mobile.changePage('#deleteDialog');
    });

    $('#confirmDelete').click(function (e) {
        e.preventDefault();

        for (var i = 0; i < contacts.length; i++) {
            if (contacts[i].id == currentContactId) {
                contacts.splice(i, 1);
                break;
            }
        }

        renderContactList();
        $.mobile.changePage('#listPage');
    });

    $('#callBtn').click(function (e) {
        e.preventDefault();
        var contact = findContact(currentContactId);

        if (contact) {
            alert('Calling ' + contact.name + ' at ' + contact.phone);
        }
    });
});
