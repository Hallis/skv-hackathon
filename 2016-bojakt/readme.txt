FE -> BE
-------------

url?key=value&key=value

<data>
<api namn="taxrate">
<param name="min_rate">23</param>
<param name="max_rate">31</param>
</api>
<api namn="systembolag">
<param name="min_avstand">0</param>
<param name="max_avstand">2000</param>
</api>
</data>


t.ex.   
    api_namn_1
        param1 = varde1
        param2 = varde2
        ..
    api_namn_2
        param1 = varde1
        param2 = varde2
        ..



Metoder:
URL/municipalities
URL/query?taxrateMin=30&taxrateMax=34&municipality=Stockholm
(alla parametrar är optional)

[
{
"id": '14 80',
"name": 'GÖTEBORG',
"location": {
            "lat": 58.3226908,
            "lng": 15.1335348
          }
"info": 'Detta är lite info om göteborg'
},
{
"id": '14 80',
"name": 'GÖTEBORG',
"location": {
            "lat": 58.3226908,
            "lng": 15.1335348
          }
"info": 'Detta är lite info om göteborg'
}
]