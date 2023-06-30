# Questions
1. How to change the code to support different file format versions?
  To support different file formats we would need to create additional 
  methods for entities that would allow us to convert them from different structures.
  E.g currently we have `constructor` method that on entity class 
  that allows us to create instances of an entity.
  
  To support different file type I would refactor constructor to take 
  just properties instead of `YamlNode` and create multiple methods to support 
  different inputs like this:
  ```ts
  export class Country {
    private constructor(
      private name: string,
      private code: string,
    ) {}
    
    static fromYamlNode(node: YamlNode) {
      // here may be code that extracts data from YamlNode structure
      return new Country(
        node.name,
        node.code,
      );
    }
    static fromJsonNode(node: YamlNode) {
      return new Country(
        node.name,
        node.code,
      );
    }
  }
  ```

2. How will the import system change if in the future we need to get this data from a web API?
  We could just make http call instead of reaching to hard drive for the file.

3. If in the future it will be necessary to do the calculations using 
  the national bank rate, how could this be added to the system?
  
  Rates don't change very frequently, so they can be stored in the database 
  in case we want to preserve ability to calculate top 3 countries using just 
  a single query.
  
  We can fetch bank rates regularly and update rows in the database.

4. How would it be possible to speed up the execution of requests if 
  the task allowed you to update market data once a day or even less frequently? 
  Please explain all possible solutions you could think of.

  To speed up execution of request in cases when data doesn't change frequently 
  we can use `caching`.  
  
  One way to cache this data would be using materialized view in the postgresql.
  This way database won't have to recalculate all the rates and exchanges every time
  we make a request.
  
  Another even easier approach would be to store the whole response in the 
  `redis` key value store. This way we won't bother database at all and 
  will get results almost immediately from memory.

5. My unfinished database query:
```sql
with trades as (
    select
        distinct on (R.id)
        (e.date - R.date) time_since_rate,
        e.id exchange_id,
        (R.out / R.in) coeff,

        e.from start_currency,
        e.ask start_volume,
        (e.ask * (R.out / R.in)) end_volume,
        e.to end_currency,
        e.date exchange_date,
        e."officeId",
        e.date,
        e.id
    from "Exchange" e
             join "Rate" R on e."officeId" = R."officeId"
    where e.date >= R.date
      and e.to = R."to"
      and e.from = R."from"
    order by R.id, time_since_rate asc, e.id
)
select
    distinct R.id,
             t.start_currency,
             t.start_volume,
             start_volume * R.out / R.in start_usd,
             t.id, *
from trades t
join "Rate" R on r."officeId" = t."officeId" and
                 R.date <= t.date and
                 R.from = t.start_currency and
                 R.to = 'USD';
```

I couldn't understand how to move forward from there, because we have 
sometimes USD ask that doesn't have any rates.