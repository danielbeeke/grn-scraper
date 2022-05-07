export function compressArray(arr: Array<number>)
    {
      const output = []
        const n = arr.length
        let i = 0, j = 0;
        arr.sort(function(a, b){return a - b});
        while (i < n)
        {
 
            // start iteration from the
            // ith array element
            j = i;
 
            // loop until arr[i+1] == arr[i]
            // and increment j
            while ((j + 1 < n) && (arr[j + 1] == arr[j] + 1))
            {
                j++;
            }
 
            // if the program do not enter into
            // the above while loop this means that
            // (i+1)th element is not consecutive
            // to i th element
            if (i == j)
            {
              output.push(arr[i])
 
                // increment i for next iteration
                i++;
            }
            else
            {
                // print the consecutive range found
                output.push(arr[i] + "-" + arr[j])

                // move i jump directly to j+1
                i = j + 1;
            }
        }

        return output
    }