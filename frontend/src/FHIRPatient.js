import React from "react";
import { FhirClientContext } from "../FhirClientContext";

function PatientName({ name = [] }) {
    let entry =
        name.find(nameRecord => nameRecord.use === "official") || name[0];
    if (!entry) {
        return <h1>No Name</h1>;
    }
    return <h1>{entry.given.join(" ") + " " + entry.family}</h1>;
}

function PatientBanner(patient) {
    return (
        <div>
            <PatientName name={patient.name} />
            <span>
                Gender: <b>{patient.gender}</b>,{" "}
            </span>
            <span>
                DOB: <b>{patient.birthDate}</b>
            </span>
        </div>
    );
}

export default class Patient extends React.Component {
    static contextType = FhirClientContext;
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            patient: null,
            error: null
        };
    }
    componentDidMount() {
        const client = this.context.client;
        this._loader = client.patient
            .read()
            .then(patient => {
                this.setState({ patient, loading: false, error: null });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    }
    render() {
        const { error, loading, patient } = this.state;
        if (loading) {
            return null;
        }
        if (error) {
            return error.message;
        }
        return <PatientBanner {...patient} />;
    }
}

var html = [
    '<body>',
    '        <h1>Documents for <span id="name"></span></h1>',
    '        <h2>Photographs</h2>',
    '        <ul id="photo_list"></ul>',
    '        <h2>Notes and Reports</h2>',
    '        <ul id="doc_list"></ul>',
    '        <script type="text/javascript">',
    '        </script>',
    '    </body>'
].join('');

var div = document.createElement('div');
    div.setAttribute('class', 'post block bc2');
    div.innerHTML = html;
    document.getElementById('posts').appendChild(div);

    (function () {
        "use strict";

        // jQuery promise object used to chain asynchronous calls using pipes
        var startingpoint=$.Deferred();
        startingpoint.resolve();

        var photo_list = document.getElementById('photo_list');
        var doc_list = document.getElementById('doc_list');

        var startsWith = function(str, target) {
            return(str.indexOf(target) == 0);
        };

        var displayDocument = function(list, title, blob) {
            if (startsWith(blob.type, "image/")) {
                list.innerHTML += (
                    "<li><h3>" + title + "</h3><p><img src='" +
                    URL.createObjectURL(blob) + "'/></p></li>"
                );
            }
            else if (startsWith(blob.type, "text/plain")) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    list.innerHTML += (
                        "<li><h3>" + title +
                        "</h3><p><textarea rows='8' cols='60'>" +
                        reader.result + "</textarea></p></li>"
                    );
                }
                reader.readAsText(blob);
            }
            else if (blob.type === "application/pdf") {
                list.innerHTML += (
                    "<li><h3>" + title + "</h3><p><object data='" +
                    URL.createObjectURL(blob) +
                    "' type='application/pdf' width='100%' height='600px' />" +
                    "</p></li>"
                );
            }
            else {
                list.innerHTML += (
                    "<li><h3>" + title + "</h3><p>[object of type <strong>" +
                    blob.type + "</strong>]</p></li>"
                );
            }
        };

        FHIR.oauth2.ready(function(smart){
            var patient = smart.patient;
            console.log("Patient: " + patient);

            patient.read().then(function(pt) {

                // Display the patient's name
                document.getElementById('name').innerHTML = pt.name[0].given.join(" ") +
                    " " +  pt.name[0].family.join(" ");

                // Fetch and display all photographs of the patient
                if (pt.photo) {
                    $.each(pt.photo, function(idx, photo) {
                        startingpoint=startingpoint.pipe( function() {
                            return $.when(smart.fetchBinary(photo.url)).then(function(blob) {
                                displayDocument(photo_list, photo.title, blob);
                            });
                        });
                    });
                }
                else {
                    photo_list.innerHTML += ("<li><h3>No photographs found</h3></li>");
                }
            });

            // Fetch and display all reports and notes for the patient
            patient.api.search({type: "DocumentReference"}) //.where.typeIn(['report','note'])
            .then(function(r) {
                var docs = r.data.entry;
                if (docs.length > 0) {
                    docs.forEach(function(doc){
                        startingpoint = startingpoint.pipe(function() {
                            return $.when(smart.fetchBinary(doc.resource.content[0].attachment.url)).then(function (blob) {
                                displayDocument(doc_list, doc.resource.description, blob);
                            });
                        });
                    });
                } else {
                    doc_list.innerHTML += ("<li><h3>No documents found</h3></li>");
                }
            });
        });
    }());