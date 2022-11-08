(function(window){
    window.extractData = function() {
      var ret = $.Deferred();
  
      function onError() {
        console.log('Loading error', arguments);
        ret.reject();
      }
  
      function onReady(smart)  {
        if (smart.hasOwnProperty('patient')) {
          var patient = smart.patient;
          var pt = patient.read();
          var obv = smart.patient.api.fetchAll({
              type: 'Observation',
              query: {
                code: {
                  $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4',
                        'http://loinc.org|8480-6', 'http://loinc.org|2085-9',
                        'http://loinc.org|2089-1', 'http://loinc.org|55284-4',
                        'https://loinc.org|3141-9', 'https://loinc.org|45675-6',
                        'https://loinc.org|48765-2'
                        ]
                } 
                /**
                    Code 8302-2: Height
                    Code 8462-4: Intravascylar Systolic - Currently used, it is updated
                    Code 8480-6: Intravascylar Systolic - Currently used, it is updated
                    Code 2085-9: Cholesterol in HDL
                    Code 2089-1: Cholesterol in LDL
                    Code 55284-4: Blood Pressure Systolic and Diastolic
                */
              }
            });
          var Aller = smart.patient.api.fetchAll({
                     type: 'AllergyIntolerance',
                     query: {
                        code: {
                            $or: [
                                'https://loinc.org|3141-9', 'https://loinc.org|45675-6',
                                'https://loinc.org|48765-2'
                            ]
                        }
                        /**
                         * Code 3141-9: Weight
                         * Code 45675-6: Allergies
                         * Code 48765-2: Allergic Reaction
                         */
                     }
          });
  
          $.when(pt, obv).fail(onError);
  
          $.when(pt, obv).done(function(patient, obv) {
            var byCodes = smart.byCodes(obv, 'code');
            var gender = patient.gender;
  
            var fname = '';
            var lname = '';
  
            if (typeof patient.name[0] !== 'undefined') {
              fname = patient.name[0].given.join(' ');
              lname = patient.name[0].family.join(' ');
            }
  
            var height = byCodes('8302-2');
            var weight = byCodes('3141-9');
            var allergy = byCodes('45675-6');
            var allreact = byCodes('48765-2');
            var medname = 'somethingelse';

  
            var p = defaultPatient();
            p.birthdate = patient.birthDate;
            p.gender = gender;
            p.fname = fname;
            p.lname = lname;
            p.height = getQuantityValueAndUnit(height[0]);
            p.weight = getQuantityValueAndUnit(weight[0]);
            p.allergy = allergy;
            p.allreact = allreact;
            p.medname = medname;
  
           /* if (typeof systolicbp != 'undefined')  {
              p.systolicbp = systolicbp;
            }
  
            if (typeof diastolicbp != 'undefined') {
              p.diastolicbp = diastolicbp;
            }
  
            //p.hdl = getQuantityValueAndUnit(hdl[0]);
           // p.ldl = getQuantityValueAndUnit(ldl[0]);
            */
            ret.resolve(p);
          });
        } else {
          onError();
        }
      }
  
      FHIR.oauth2.ready(onReady, onError);
      return ret.promise();
  
    };
  
    function defaultPatient(){
      return {
        fname: {value: ''},
        lname: {value: ''},
        gender: {value: ''},
        birthdate: {value: ''},
        height: {value: ''},
        weight: {value: ''},
        allergy: {value: ''},
        allreact: {value: ''},
        medname: {value: ''},
        meddose: {value: ''},
        medfreq: {value: ''},
        chol: {value: ''},
        ColoSig: {value: ''},  
        mammo: {value: ''},
        papsme: {value: ''},
        bonedens: {value: ''},
        vacc: {value: ''},
        vaccdate: {value: ''},
        DesMDH: {value: ''},
        DesSurg: {value: ''},
        DateLMC: {value: ''},
        TotNumoPreg: {value: ''},
        NumoLB: {value: ''},
        PregComp: {value: ''},
        FamMH: {value: ''},
        FamMHRel: {value: ''},
        SocHis: {value: ''},
        TobUs: {value: ''},
        AlcUs: {value: ''},
        SexAc: {value: ''},
        Exer: {value: ''},
        Sleep: {value: ''},
        Diet: {value: ''},
        Safet: {value: ''},
        ProvName: {value: ''},
        ProvPhonenum: {value: ''},
        AddInfoDesc: {value: ''},
        RevoSysDesc: {value: ''} 

      };
    }
  
    function getBloodPressureValue(BPObservations, typeOfPressure) {
      var formattedBPObservations = [];
      BPObservations.forEach(function(observation){
        var BP = observation.component.find(function(component){
          return component.code.coding.find(function(coding) {
            return coding.code == typeOfPressure;
          });
        });
        if (BP) {
          observation.valueQuantity = BP.valueQuantity;
          formattedBPObservations.push(observation);
        }
      });
  
      return getQuantityValueAndUnit(formattedBPObservations[0]);
    }
  
    function getQuantityValueAndUnit(ob) {
      if (typeof ob != 'undefined' &&
          typeof ob.valueQuantity != 'undefined' &&
          typeof ob.valueQuantity.value != 'undefined' &&
          typeof ob.valueQuantity.unit != 'undefined') {
            return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
      } else {
        return undefined;
      }
    }
  
    window.drawVisualization = function(p) {
      $('#holder').show();
      $('#loading').hide();
      $('#fname').html(p.fname);
      $('#lname').html(p.lname);
      $('#gender').html(p.gender);
      $('#birthdate').html(p.birthdate);
      $('#height').html(p.height);
      $('#weight').html(p.weight);
      $('#allergy').html(p.allergy);
      $('#allreact').html(p.allreact);
      $('#medname').html(p.medname);
      $('#meddose').html(p.meddose);
      $('#medfreq').html(p.medfreq);
      $('#chol').html(p.chol);
      $('#ColoSig').html(p.ColoSig);
      $('#mammo').html(p.mammo);
      $('#papsme').html(p.papsme);
      $('#bonedens').html(p.bonedens);
      $('#vacc').html(p.vacc);
      $('#vaccdate').html(p.vaccdate);
      $('#DesMDH').html(p.DesMDH);
      $('#DesSurg').html(p.DesSurg);
      $('#DateLMC').html(p.DateLMC);
      $('#TotNumoPreg').html(p.TotNumoPreg);
      $('#NumoLB').html(p.NumoLB);
      $('#PregComp').html(p.PregComp);
      $('#FamMH').html(p.FamMH);
      $('#FamMHRel').html(p.FamMHRel);
      $('#SocHis').html(p.SocHis);
      $('#TobUs').html(p.TobUs);
      $('#AlcUs').html(p.AlcUs);
      $('#SexAc').html(p.SexAc);
      $('#Exer').html(p.Exer);
      $('#Sleep').html(p.Sleep);
      $('#Diet').html(p.Diet);
      $('#Safet').html(p.Safet);
      $('#ProvName').html(p.ProvName);
      $('#ProvPhonenum').html(p.ProvPhonenum);
      $('#AddInfoDesc').html(p.AddInfoDesc);
      $('#RevoSysDesc').html(p.RevoSysDesc); 

    //   $('#').html(p.);
    //   $('#systolicbp').html(p.systolicbp);
    //   $('#diastolicbp').html(p.diastolicbp);
    //   $('#ldl').html(p.ldl);
    //   $('#hdl').html(p.hdl);
    };
  
  })(window);